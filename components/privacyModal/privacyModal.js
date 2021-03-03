const app = getApp()

Component({

  properties: {

  },

  data: {},

  methods: {

    showPrivacyModal: function () {
      this.setData({
        showPrivacyModal: true
      })
    },

    hidePrivacyModal: function () {
      this.setData({
        showPrivacyModal: false
      })
    },

    getPhoneNumber: function (e) {
      this.hidePrivacyModal()
      wx.setStorageSync('privacy', true)
      this.triggerEvent('accept', true)
      console.log(e)
      if (e.detail.errMsg == 'getPhoneNumber:ok') {
        var phoneData = (({encryptedData, iv}) => ({encryptedData, iv}))(e.detail)
        app.globalData.phoneData = phoneData
      } else {
        // user reject auth
        console.log(e.detail.errMsg)
      }
      this.triggerEvent('phone', true)
    },

    reject: function () {
      this.hidePrivacyModal()
    }
  }
})