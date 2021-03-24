const iamServe = require('../../services/iamService')
const toast = require('../../utils/toast')

Page({

  data: {

  },

  onLoad: function (options) {
    if(options.access_token) {
      var that = this
      var token = options.access_token
      iamServe.introspect(token).then(res => {
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
  }
})