const app = getApp()
const tokenServe = require('../../services/tokenService')
const toast = require('../../utils/toast')
const string = require('../../utils/string')
// TODO dynamic path 
var path = '../setting/setting'

Page({

  data: {
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    render: false
  },

  onLoad: function (options) {
    if (options.code && options.state) {
      this.getAuthorizeCode(options)
    } else {
      this.checkToken()
    }
    this.checkUserInfoAuth()
    this.privacyModal = this.selectComponent('#privacyModal')
  },

  /**
   * get authorizd code
   */
  getAuthorizeCode: function (options) {
    var code = options.code
    var state = options.state
    if (state == wx.getStorageSync('state')) {
      this.render(false)
      this.loginToken(code)
    } else {
      this.render(true)
    }
  },

  /**
   * code exchange token
   */
  loginToken: function (code) {
    var that = this
    tokenServe.getToken(code).then(res => {
      if (res.status) {
        that.enterPage(path)
      } else {
        that.render(true)
        toast.showMsg(res.errMsg)
      }
    }).catch(res => {
      that.render(true)
      toast.showMsg(res.errMsg)
    })
  },

  /**
   * check token exist and valid
   */
  checkToken: function () {
    var token_str = wx.getStorageSync('token')
    if (!string.isStrBlank(token_str)) {
      var token = JSON.parse(token_str)
      var expire = token.data_expiration
      var now = Date.parse(new Date())
      if (expire <= now) {
        this.refreshToken(token.refresh_token)
      } else {
        this.render(false)
        this.enterPage(path)
      }
    } else {
      this.render(true)
    }
  },

  refreshToken(refreshToken) {
    var that = this
    tokenServe.refreshToken(refreshToken).then(res => {
      if (res.status) {
        that.render(false)
        that.enterPage(path)
      } else {
        that.render(true)
      }
    }).catch(res => {
      that.render(true)
    })
  },

  /**
   * check userinfo auth
   */
  checkUserInfoAuth: function () {
    if (app.globalData.userData) {
      this.setData({
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          const userData = (({
            encryptedData,
            iv
          }) => ({
            encryptedData,
            iv
          }))(res)
          app.globalData.userData = userData
          this.setData({
            hasUserInfo: true
          })
        }
      })
    }
  },

  getUserInfo: function (e) {
    if (e.detail.userInfo && !app.globalData.userData) {
      const userData = (({
        encryptedData,
        iv
      }) => ({
        encryptedData,
        iv
      }))(e.detail)
      console.log(userData)
      app.globalData.userData = userData
      this.setData({
        hasUserInfo: true
      })
      this.privacyModal.showPrivacyModal()
    } else {
      // user reject auth
      console.log(e.detail.errMsg)
    }

  },

  privacyConfirm: function (e) {
    console.log(e.detail)
    if (e.detail) {
      this.uploadUserData()
    }
  },

  goWebView: function (e) {
    wx.setStorageSync('type', 'wechat')
    wx.navigateTo({
      url: '../udi/udi',
    })
  },

  wxLogin: function () {
    console.log('user info authed before..')
    if (wx.getStorageSync('privacy')) {
      this.uploadUserData()
      this.goWebView()
    } else {
      this.privacyModal.showPrivacyModal()
    }
  },

  /**
   * TODO upload decrypted userInfo - app.globalData.userData
   */
  uploadUserData() {
    console.log('upload userData...')
  },

  onShow() {
    app.globalData.AdobeSDK.trackState("show")
  },

  tradLogin: function () {

    app.globalData.AdobeSDK.trackAction("action", { "trdlogin": "click" });

    wx.setStorageSync('type', 'trad')
    wx.navigateTo({
      url: '../udi/udi'
    })
  },

  enterPage(path) {
    wx.redirectTo({
      url: path
    })
  },

  render: function (flag) {
    this.setData({
      render: flag
    })
  }

})