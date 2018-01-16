// pages/index/Share/ShareHotMoney.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo:[],
    hongbaoUrl:"",
    hongbaoDetail:[]
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that  = this;
    //根据id查询红包详情
    console.log(options.id)
    wx.request({
      url: that.data.hongbaoUrl,
      data: {
        id: options.id
      },
      success: function (res) {
        console.log(res)
        var that = this;
        that.setData({
          userInfo: app.globalData.userInfo,
          hongbaoDetail: res.data,
        })
      }
      ,
      fail: function (res) {

      }
    })
    that.data.hongbaoDetail.type=1
    console.log(that.data.hongbaoDetail.type)
  },
  toshareChat:function(){
    
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
    console.log("onShow")
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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var Object=[]
    Object.title="包一抢"
    Object.desc="新年快乐"
    Object.path ="pages/index/share/share?id=123"
    return Object
  }
})