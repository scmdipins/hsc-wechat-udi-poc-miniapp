const app = getApp()
const clientServe = require('../utils/clientConfig')

const getUserInfo = token => {
  wx.showLoading()
  var resp = {}
  var type = wx.getStorageSync('type')  
  var client = clientServe.client(type)
  return new Promise((resolve, reject) => {
    wx.request({
      url: client.domain + 'profiles/oidc/userinfo',
      method: 'GET',
      header: {
        'Authorization': 'Bearer ' + token
      },
      data: {
        'ui_locales': 'zh-CN',
        'client_id': client.clientId
      },
      success(res) {
        wx.hideLoading()
        if (res.data.phone_number) {
          resp = {
            'status': true,
            'data': res.data
          }
        } else if (res.data.error_description) {
          resp = getFailedResp(res.data.error_description)
        } else {
          resp = getFailedResp('get profile failed')
        }
        return resolve(resp)
      },
      fail(e) {
        wx.hideLoading()
        resp = getFailedResp('get profile failed')
        return reject(e)
      }
    })
  })
}

function getFailedResp(errMsg) {
  return {
    'status': false,
    'errMsg': errMsg
  }
}

module.exports = {
  getUserInfo: getUserInfo
}