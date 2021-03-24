const tokenServe = require('../../services/tokenService')
const string = require('../../utils/string')
const toast = require('../../utils/toast')

Page({

  data: {

  },

  onLoad: function (options) {
    this.hintModal = this.selectComponent('#hintModal')
  },

  showAccountHintModal() {
    this.hintModal.showHintModal()
  },

  logout() {
    // TODO  logout SSO session still exist
    var token_str = wx.getStorageSync('token')
    if (!string.isStrBlank(token_str)) {
      var token = JSON.parse(token_str)
      tokenServe.revokeToken(token.access_token).then(res => {
        if (res.status) {
          wx.clearStorageSync()
          wx.reLaunch({
            url: '../login/login'
          })
        } else {
          toast.showMsg(res.errMsg)
        }
      }).catch(res => {
        toast.showMsg(res.errMsg)
      })
    }

  }

})