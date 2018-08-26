const api = require('service/api.js');

App({
  onLaunch: function () {

  },
  onShow: function () {
    // 获取用户授权基本信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          let user = wx.getStorageSync('MYAPP_USER')//判断用户是否登陆
          console.log(user)
          if (!user) {
            wx.getUserInfo({//获取用户信息
              success: user => {
                wx.login({
                  success: res => {
                    let parmas = {
                      code: res.code,
                      nickname: user.nickName,
                      avatar_url: user.avatarUrl,
                      gender: user.gender,
                      address: `${user.country}/${user.province}/${user.city}`,
                    }
                    //创建用户
                    api.creatWxUsers(parmas).then((result) => {
                      //用户信息保存全局
                      let data = {
                        username: result.data.rows.loginname,
                        password: result.data.rows.loginname,
                      }
                      //登陆获取token信息
                      api.authorized(data).then((res) => {
                        this.globalData.userInfo = result.data.rows
                        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                        // 所以此处加入 callback 以防止这种情况
                        if (this.userInfoReadyCallback) {
                          this.userInfoReadyCallback(res)
                        }
                      })
                    })
                  }
                })
              }
            })
          } else {
            this.globalData.userInfo = user
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (this.userInfoReadyCallback) {
              this.userInfoReadyCallback(res)
            }
          }
        } else {
          wx.redirectTo({ url: '/pages/authorize/authorize' })
        }
      }
    })
  },
  api: api,
  globalData: {
    userInfo: null
  }
})