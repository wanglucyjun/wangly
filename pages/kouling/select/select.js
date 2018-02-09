// pages/kouling/select/select.js
const app = getApp()
var methods = require('../../../utils/methods.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tips: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var tipArray = methods.getModel(1).tips;
    var that=this;
    var list = tipArray
    for (var i = 0, len = list.length; i < len; ++i) {
      that.data.tips[i] = { content: list[i],id:i}
    }
    console.log(that.data.tips);

    this.setData({
      tips: that.data.tips
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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
  kindToggle: function (e) {
    console.log(e)
    var id = e.currentTarget.id, list = this.data.tips;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        app.globalData.koulingtips = list[i].content
      } else {
       
      }
    }
    //返回
    wx.navigateBack({
      delta: 1
    })
  }
})