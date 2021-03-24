const iamService = require('../../services/iamService')
const toast = require('../../utils/toast')

Page({

  data: {
    token: {},
    btnActive: {
      profile: false,
      manager: false,
      iam: false,
      account: false
    }
  },

  onLoad: function (options) {
    this.setData({
      type: wx.getStorageSync('type')    
    })
    var token = JSON.parse(wx.getStorageSync('token'))
    if (token) {
      this.data.token = token
    }
  },

  onShow() {
    this.initBtnStatus()
  },

  goProfilePage() {
    this.activeBtn('profile')
    var token = this.data.token
    wx.navigateTo({
      url: '../profile/profile?access_token=' + token.access_token
    })
  },

  iamAuth() {
    this.activeBtn('iam')
    var idToken = this.data.token.id_token
    console.log('idToken:' + idToken)
    iamService.getIAMToken(idToken).then(res => {
      if (res.status) {
        var token = res.data
        wx.navigateTo({
          url: '../iam/iam?access_token=' + token.access_token
        })
      } else {
        toast.showMsg(res.errMsg)
        this.initBtnStatus()
      }
    }).catch(res => {
      toast.showMsg(res.errMsg)
      this.initBtnStatus()
    })
  },

  goManagerPage() {
    this.activeBtn('manager')
    wx.navigateTo({
      url: '../manager/manager'
    })
  },

  goAccountPage() {
    this.activeBtn('account')
    wx.navigateTo({
      url: '../account/account'
    })
  },

  activeBtn(name) {
    var btnActive = this.data.btnActive
    btnActive[name] = true
    this.setData({
      btnActive: btnActive
    })
  },

  initBtnStatus() {
    var btnActive = this.data.btnActive
    for (let item in btnActive) {
      btnActive[item] = false
    }
    this.setData({
      btnActive: btnActive
    })
  }
  
})