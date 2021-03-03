function getClient(type) {
  return {
    domain: 'https://tst.accounts.philips.com.cn/849875c3-ac1e-4bf9-80ed-5a5bb61944bf/',
    redirectUri: 'https://tst.authz.accounts.philips.com.cn/udi-authz/static/redirect.html',
    clientId: 'trad' == type ? '6d388991-4915-401f-a8e0-f94841fe43a6' : 'b5d5180e-e60c-4869-84c8-90b4a3d04a0f',
    assertDomain: 'https://tst.cn-north-1.api.philips.com/'
  }
}

module.exports = {
  client: getClient
}