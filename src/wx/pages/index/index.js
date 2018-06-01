const app = getApp()

Page({
  data: {
    user: {}
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        user: app.globalData.userInfo,
      })
    } else {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          user: app.globalData.userInfo
        })
      }
    }
  },
})
