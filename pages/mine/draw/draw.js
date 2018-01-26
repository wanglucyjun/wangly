const app = getApp()
// pages/mine/draw.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance:0.00,
    money:0.00
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.setData({
      balance:10,
      money: 0,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },
  MoneyInput: function (e) {
    var that = this;
    console.log(e.detail.value)
    if (e.detail.value > that.data.balance){
      wx.showModal({
        title: '提示',
        content: '提现金额不能大于余额'
    })
    }else{
      that.setData({
        money: e.detail.value,
      })
    }
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  getMoney: function () {
    var that = this;
    app.checkSession({
      success: function () {
        wx.request({
          url: that.data.hongbaoReceivedUrl,
          data: {
            token: app.globalData.sessionInfo,
            money:that.data.money
          },
          success: function (res) {
            console.log(res)
            
          }
          ,
          fail: function (res) {

          }
        })
      }
    })
  }
})