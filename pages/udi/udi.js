const app = getApp()
const tokenServe = require('../../services/tokenService')
const clientServe = require('../../utils/clientConfig')
const CryptoJS = require('../../utils/crypto-js.min')
const toast = require('../../utils/toast')

Page({

  data: {
    url: ''
  },

  onLoad: function (options) {
    var state = this.generateUUID()
    var codeVerifier = this.generateCodeVerifier()
    var codeChallenge = this.generateCodeChallenge(codeVerifier)
    var nonce = this.generateNonce(32)
    this.setUrl(state, codeChallenge, nonce)
    getApp().setWatcher(this.data, this.watch);
  },

  setUrl(state, codeChallenge, nonce) {
    var that = this
    var type = wx.getStorageSync('type')  
    var client = clientServe.client(type)
    var url = client.domain + 'login/authorize?client_id=' + client.clientId + '&redirect_uri=' + client.redirectUri + '&response_type=code%20id_token&scope=openid%20profile%20phone&state=' + state + '&ui_locales=zh-CN&code_challenge=' + codeChallenge + '&code_challenge_method=S256&nonce=' + nonce + 
    // '&resource=urn:ietf:params:oauth:client_id:501f7b8d-b612-4cd5-8d48-b0b7f7e11980'
    '&resource=urn:ietf:params:oauth:client_id:501f7b8d-b612-4cd5-8d48-b0b7f7e11980&resource=urn:ietf:params:oauth:client_id:10cd5e18-db6d-4f77-8e88-4439483608db'

    if ('wechat' == type) {
      wx.login({
        success(res) {
          app.globalData.code = res.code
          that.setAssertUrl(url, nonce)
        },
        fail() {
          toast.showMsg('invalid code')
        }
      })
    } else {
      this.setData({
        url: url
      })
    }
    console.log('url: ' + url)
  },

  setAssertUrl(url, nonce) {
    var that = this
    tokenServe.getAssertToken(nonce).then(res => {
      if (res.status) {
        that.setData({
          url: url + '&prompt=none&id_token_hint=' + res.assertToken
        })
      } else {
        toast.showMsg(res.errMsg)
      }
    }).catch(res => {
      toast.showMsg(res.errMsg)
    })
  },

  generateUUID() {
    var s = [];
    var hexDigits = "0123456789abcdef"
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
    }
    s[14] = "4" // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-"
    var uuid = s.join("")
    wx.setStorageSync('state', uuid)
    return uuid
  },

  /**
   * generate random string which length is 32
   */
  generateNonce(length) {
    var nonce = ''
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    for (var i = length; i > 0; --i) nonce += chars[Math.floor(Math.random() * chars.length)]
    console.log('nonce: ' + nonce)
    return nonce
  },

  generateCodeVerifier() {
    var codeVerifier = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
    for (var i = 0; i < 128; i++) {
      codeVerifier += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    wx.setStorageSync('codeVerifier', codeVerifier)
    console.log('codeVerifier: ' + codeVerifier)
    return codeVerifier
  },

  generateCodeChallenge(codeVerifier) {
    var sha256digest = CryptoJS.SHA256(codeVerifier)
    var codeChallenge = CryptoJS.enc.Base64.stringify(sha256digest).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
    console.log('codeChallenge: ' + codeChallenge)
    return codeChallenge
  },

  watch: {
    url: function (newValue) {
      // console.log(newValue) // name改变时，调用该方法输出新值。
    }
  }

})