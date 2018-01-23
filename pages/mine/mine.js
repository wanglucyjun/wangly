// pages/mine/mine.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    userHongbao:{},//用户红包信息
    sendedHongbao:{},//发送的红包信息
    receivedHongbao:{},//接受的红包信息
    mineRecod:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   var that = this;
   var userInfo = app.globalData.userInfo;
   that.setData({
     userInfo: app.globalData.userInfo,
   })
  },
  // tab 切换函数
  changeTab: function (e) {
    var that = this;
    that.setData({
      mineRecod: e.currentTarget.dataset.num
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

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    refresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.mineRecod==1){
      this.getReceivedHongbao();
    } else if (this.data.mineRecod == 2){
      this.getSendedHongbao();
    }

  },
  getReceivedHongbao:function(){
    var that = this;
    wx.request({
      url: that.data.hongbaoReceivedUrl,
      data: {
        token: app.globalData.sessionInfo,
        page: that.data.receivedHongbao.page+1
      },
      success: function (res) {
        console.log(res)
        that.setData({
          receivedHongbao: res.data
        })
      }
      ,
      fail: function (res) {

      }
    })
  },
  getSendedHongbao: function() {
    var that = this;
    wx.request({
      url: that.data.hongbaoSendedUrl,
      data: {
        token: app.globalData.sessionInfo,
        page: that.data.sendedHongbao.page + 1
      },
      success: function (res) {
        console.log(res)
        that.setData({
          sendedHongbao: res.data
        })
      }
      ,
      fail: function (res) {

      }
    })
  },
  refresh:function(){
    var that = this;
    wx.request({
      url: that.data.hongbaoUrl,
      data: {
        token: app.globalData.sessionInfo
      },
      success: function (res) {
        console.log(res)
        that.setData({
          userInfo: app.globalData.userInfo,
          userHongbao: res.data,
        })
      }
      ,
      fail: function (res) {

      }
    })
    that.data.sendedHongbao.page=0
    that.data.receivedHongbao.page = 0
    getReceivedHongbao()
    getSendedHongbao()
  },
  /**
   * 提现交互
   */
  getMoney:function(){
    wx.navigateTo({
      url: 'draw/draw',
    })
  }
})