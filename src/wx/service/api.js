const CONFIG = require('../config/index.js');
const Base64 = require('../utils/we-base64.js');
const moment = require('../utils/moment.js');
const SIGNATURE = Base64.encode(`${CONFIG.CLIENT_ID}:${CONFIG.CLIENT_SECRET}`);//app标识进行base64编码

module.exports = {
  //登陆认证接口
  authorized(data) {
    return new Promise((resolve, reject) => {
      let datas = {
        username: data.username,
        password: data.password,
        grant_type: 'password'
      }
      wx.request({
        url: CONFIG.API_HOST + '/oauth/token',
        method: 'POST',
        data: datas,
        timeout: CONFIG.TIMEOUT,
        header: {
          'Accept': 'application/json; charset=utf-8',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + SIGNATURE
        },
        success: function (token) {
          if (token.statusCode == 200) {
            let USER_TOKEN = {
              token_type: "bearer",
              access_token: token.data.access_token,
              refresh_token: token.data.refresh_token,
              expire: moment().add(3, 'd'),//token过期时间
            };
            wx.setStorageSync('MYAPP_USER', token.data.user)
            wx.setStorageSync('USER_TOKEN', USER_TOKEN)
            return resolve(token.data.user)
          }
        },
      })
    })
  },
  //刷新token验证
  getApiToken() {
    return new Promise((resolve, reject) => {
      let token = wx.getStorageSync('USER_TOKEN')
      if (!token)
        return resolve();
      if (moment().isBefore(moment(token.expire).format('YYYY-MM-DD HH:mm:ss'))) {
        return resolve(token);
      }
      let datas = 'refresh_token=' + token.refresh_token + '&grant_type=refresh_token';
      wx.request({
        url: CONFIG.API_HOST + '/oauth/token',
        method: 'POST',
        data: datas,
        timeout: CONFIG.TIMEOUT,
        header: {
          'Accept': 'application/json; charset=utf-8',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + SIGNATURE
        },
        success: function (token) {
          let USER_TOKEN = {
            token_type: "bearer",
            access_token: token.data.access_token,
            refresh_token: token.data.refresh_token,
            expire: moment().add(3, 'd'),//token过期时间
          };
          wx.setStorageSync('USER_TOKEN', USER_TOKEN)
          return resolve(USER_TOKEN)
        },
        fail: function (res) {
          return reject(res)
        },
      })
    })
  },
  //公共接口
  callApi(url, method = 'GET', data) {
    let self = this
    wx.showLoading({
      title: '数据加载中',
      mask: true
    })
    return this.getApiToken().then((token) => {
      return new Promise((resolve, reject) => {
        wx.request({
          url: CONFIG.API_HOST + url,
          method: method,
          data: data,
          timeout: CONFIG.TIMEOUT,
          header: {
            'Accept': 'application/json; charset=utf-8',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': token && `Bearer ${token.access_token}`.replace(/(^\")|(\"$)/g, '')
          },
          success: function (res) {
            if (res.statusCode == 200) {
              wx.hideLoading();
              return resolve(res)
            } else if (res.statusCode == 401) {
              wx.hideLoading();
              let user = wx.getStorageSync('MYAPP_USER');
              let data = {
                username: user.loginname,
                password: user.loginname
              }
              self.authorized(data).then((res) => {
                return resolve()
              })
            } else {
              wx.hideLoading();
            }
          },
        })
      })
    });
  },
  //获取用户列表
  getUsers(data) {
    let datas = {
      page_size: 10,
      page_number: 1
    }
    return this.callApi('/organization/v1/users', 'get', datas)
  },
  //创建微信登陆用户信息
  creatWxUsers(params) {
    return this.callApi('/organization/v1/users/wx', 'post', params)
  },

}
