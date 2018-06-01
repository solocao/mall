const app = getApp()
Page({

  data: {
  },

  onLoad: (options) => {
    wx.hideLoading();
  },
  //授权登陆
  _getUserInfo: (e) => {
    if (e.detail.userInfo) {
      // 登录获取open_id
      let user = e.detail.userInfo
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
          app.api.creatWxUsers(parmas).then((result) => {
            //用户信息保存全局
            let data = {
              username: result.data.rows.loginname,
              password: result.data.rows.loginname,
            }
            //登陆获取token信息
            app.api.authorized(data).then((res) => {
              app.globalData.userInfo = result.data.rows
              wx.switchTab({ url: '/pages/index/index' })
            })
          })
        }
      })
    } else {//取消授权
      wx.showToast({
        title: '未授权',
        icon: 'none',
        duration: 2000
      })
    }
  },
})