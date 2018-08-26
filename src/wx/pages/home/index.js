const app = getApp()

Page({
  data: {
    user: {}
  },
  onLoad: function() {
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
  _uploadImg: function() {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        wx.showLoading({
          title: '图片上传中',
          mask: true
        })
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        tempFilePaths.forEach(function(item) {
          wx.uploadFile({
            url: 'http://47.98.174.1:3001/storage/v1/files/upload',
            filePath: item,
            name: 'file',
            formData: {
              'title': '图片',
            },
            success: function(res) {
              wx.hideLoading();
              wx.showToast({
                title: "图片上传成功。",
                icon: 'loading',
                duration: 500
              })
            },
            fail: function(err) {
              wx.hideLoading();
              wx.showToast({
                title: "图片上传失败。",
                icon: 'loading',
                duration: 500
              })
            }
          })
        });
      }
    })
  },
})