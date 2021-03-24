const clientServe = require('../../utils/clientConfig')

Page({

  data: {
  },
  
  onLoad: function (options) {
    var client = clientServe.client('trad')
    var url = client.domain + 'auth-ui/profile?client_id=' + client.clientId + '&ui_locales=zh-CN'
    console.log('url: ' + url)
    this.setData({
      url: url
    })
  }

})