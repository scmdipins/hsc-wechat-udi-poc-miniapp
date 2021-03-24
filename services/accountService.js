const clientServe = require('../utils/clientConfig')

function logout() {
  var type = wx.getStorageSync('type')  
  var client = clientServe.client(type)
  return new Promise((resolve, reject) => {
    wx.request({
      url: client.domain + 'auth-ui/logout',
      method: 'GET',
      header:{
        'content-type': 'application/json'
      },
      data: {
        'client_id': client.clientId
      },
      success(res) {
        return resolve(res.statusCode)
      },
      fail(res) {
        return reject('logout failed')
      }
    })
  })
}

module.exports = {
  logout: logout
}