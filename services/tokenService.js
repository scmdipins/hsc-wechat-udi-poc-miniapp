const app = getApp()
const clientServe = require('../utils/clientConfig')

const getAssertionToken = nonce => {
  var data = {
    'nonce': nonce,
    'jscode': app.globalData.code,
    'profile': app.globalData.userData.encryptedData,
    'iv_profile': app.globalData.userData.iv,
    'app_id': wx.getAccountInfoSync().miniProgram.appId
  }
  var phoneData = app.globalData.phoneData
  if (phoneData && phoneData.iv) {
    data.phone = phoneData.encryptedData
    data.iv_phone = phoneData.iv
  }
  var requestData = {
    'data': data
  }
  var client = clientServe.client(app.globalData.type) 
  return new Promise((resolve, reject) => {
    var resp = {}
    wx.request({
      url: client.assertDomain + 'consumerIdentityService/miniapp',
      method: 'POST',
      header: {
        'Api-Key': 'az6XV80qHM7LrQN1Qzo8m3M63z2Wig36g6fRBALg',
        'Api-Version': '1',
        'content-type': 'application/json'
      },
      data: requestData,
      success(res) {
        if (res.data.data) {
          resp = {
            'status': true,
            'assertToken': res.data.data.identityAssertion
          }
        } else if (res.data.errors) {
          resp = getFailedResp(res.data.errors.title)
        } else {
          resp = getFailedResp('get assertion token failed')
        }
        return resolve(resp)
      },
      fail(e) {
        resp = getFailedResp('get assertion token failed')
        return reject(resp)
      }
    })
  })
}

const getToken = code => {
  var client = clientServe.client(app.globalData.type)
  var data = {
    'grant_type': 'authorization_code',
    'code': code,
    'client_id': client.clientId,
    'code_verifier': wx.getStorageSync('codeVerifier'),
    'redirect_uri': client.redirectUri
  }

  // data = json2Urlencoded(data)

  return new Promise((resolve, reject) => {
    var resp = {}
    wx.request({
      url: client.domain + 'login/token',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
        // 'content-type': 'application/texts'
      },
      data: data,
      success(res) {
        wx.removeStorageSync('codeVerifier')
        if (res.data.access_token) {
          var token = res.data
          var timestamp = Date.parse(new Date())
          token.data_expiration = timestamp + token.expires_in * 1000
          // token.data_expiration = timestamp + 10000
          wx.setStorageSync('token', JSON.stringify(token))
          resp = {
            'status': true
          }
        } else if (res.data.error_description) {
          resp = getFailedResp(res.data.error_description)
        } else {
          resp = getFailedResp('code exchange token failed')
        }
        return resolve(resp)
      },
      fail(e) {
        resp = getFailedResp('code exchange token failed')
        return reject(resp)
      }
    })
  })
}

function json2Urlencoded(element, key, list) {
  var list = list || [];
  if (typeof (element) == 'object') {
    for (var idx in element)
      this.JSON_to_URLEncoded(element[idx], key ? key + '[' + idx + ']' : idx, list)
  } else {
    list.push(key + '=' + encodeURIComponent(element))
  }
  return list.join('&')
}

const refreshToken = refreshToken => {
  var resp = {}
  var client = clientServe.client(app.globalData.type)
  return new Promise((resolve, reject) => {
    wx.request({
      url: client.domain + 'login/token',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'grant_type': 'refresh_token',
        'client_id': client.clientId,
        'refresh_token': refreshToken
      },
      success(res) {
        if (res.data.access_token) {
          var token = res.data
          var timestamp = Date.parse(new Date())
          token.data_expiration = timestamp + token.expires_in * 1000
          // token.data_expiration = timestamp + 10000
          wx.setStorageSync('token', JSON.stringify(token))
          resp = {
            'status': true
          }
        } else {
          wx.removeStorageSync('token')
          resp = getFailedResp('refresh token failed')
        }
        return resolve(resp)
      },
      fail(e) {
        wx.removeStorageSync('token')
        resp = getFailedResp('refresh token failed')
        return reject(resp)
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
  getToken: getToken,
  refreshToken: refreshToken,
  getAssertToken: getAssertionToken
}