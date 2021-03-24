const iamClient = require('../utils/clientConfig').iamClient
const base64 = require('../utils/base64').Base64

function make_base_auth() {
  var credential = iamClient.credential
  var tok = credential.username + ':' + credential.password  
  var hash = base64.encode(tok) 
  return "Basic " + hash
} 

const getIAMToken = idToken => {
  var resp = {}
  var auth = make_base_auth()
  wx.showLoading({
    title: 'loading'
  })
  return new Promise((resolve, reject) => {
    wx.request({
      url: iamClient.domain + 'authorize/oidc/token_exchange',
      method: 'POST',
      header: {
        'api-version': '1',
        'content-type': 'application/json',
        'Authorization': auth
      },
      data: {
        'id_token': idToken,
        'provider': 'pimdemoapp2',
        'redirect_uri': iamClient.redirectUri
      },
      success(res) {
        wx.hideLoading()
        if (res.data.access_token) {
          resp = {
            'status': true,
            'data': res.data
          }
        } else {
          resp = getFailedResp('exchange IAM token failed')
        }
        return resolve(resp)
      },
      fail(e) {
        wx.hideLoading()
        resp = getFailedResp('exchange IAM token failed')
        return reject(e)
      }
    })
  })
}

const introspect = token => {
  var resp = {}
  var auth = make_base_auth()
  wx.showLoading({
    title: 'loading'
  })
  return new Promise((resolve, reject) => {
    wx.request({
      url: iamClient.domain + 'authorize/oauth2/introspect',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': auth,
        'Api-version': '4'
      },
      data: {
        'token': token
      },
      success(res) {
        wx.hideLoading()
        if (res.data.username) {
          resp = {
            'status': true,
            'data': res.data
          }
        } else {
          resp = getFailedResp('introspect IAM failed')
        }
        return resolve(resp)
      },
      fail(e) {
        wx.hideLoading()
        resp = getFailedResp('introspect IAM failed')
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
  getIAMToken: getIAMToken,
  introspect: introspect
}