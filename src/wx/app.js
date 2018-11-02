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
                    this.globalData.userInfo = result.data.rows
                    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                    // 所以此处加入 callback 以防止这种情况
                    if (this.userInfoReadyCallback) {
                      this.userInfoReadyCallback(res)
                    }
                    return ; //
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
          wx.reLaunch({ url: '/pages/authorize/authorize' })
          // wx.reLaunch({ url: '/pages/home/index' })
        }
      }
    })
  },
  api: api,
  globalData: {
    userInfo: null,
    awards: null,//已选择奖项1:龙泉驿英才计划A类人才（国际顶尖）,2:龙泉驿英才计划B类人才（国家领军）,3:龙泉驿英才计划C类人才（地方高级）,4:龙泉驿英才计划D类人才（骨干精英）
    jobs:null,//就业意向1:就业，2:创业
    tags: null,//个性标签1:智商逆天，2:傲娇满分，3:颜值逆天，4:超级学霸，5:文艺小清新，6:好奇宝宝，6:学霸宝宝，6:呆萌学者，6:霸道总裁，
    skills:null,//专业
  }
})