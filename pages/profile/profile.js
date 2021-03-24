const profileServe = require('../../services/profileService')
const toast = require('../../utils/toast')

Page({

  data: {
    user: {}
  },

  onLoad: function (options) {
    if(options.access_token) {
      this.getProfile(options.access_token)
    }
  },

  getProfile(token) {
    var that = this
    profileServe.getUserInfo(token).then(res => {
      if (res.status) {
        that.setData({
          user: res.data
        })
      } else {
        toast.showMsg(res.errMsg)
      }
    }).catch(res => {
      toast.showMsg(res.errMsg)
    })
  }
  
})