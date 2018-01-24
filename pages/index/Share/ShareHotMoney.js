// pages/index/Share/ShareHotMoney.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hongbaoID: '123',
    hongbaoDetail:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that  = this;
    var hongbaoDetail = {}
    hongbaoDetail.id = options.id
    hongbaoDetail.senderName = app.globalData.userInfo.nickName
    hongbaoDetail.senderIcon = app.globalData.userInfo.avatarUrl
    hongbaoDetail.state = 1
    hongbaoDetail.allNum = 5
    hongbaoDetail.allMoney = 10
    hongbaoDetail.leftNum = 3
    hongbaoDetail.leftMoney = 6
    hongbaoDetail.type = 1
    hongbaoDetail.content = { question: '哈哈', answer: '' }
    hongbaoDetail.list = [{ name: hongbaoDetail.senderName, iocn: hongbaoDetail.senderIcon, money: 2, url: '123', date: '1月16日 20:30', length: 3 },
    {
      name: hongbaoDetail.senderName, iocn: hongbaoDetail.senderIcon, money: 3,
      url: '456', date: '1月17日 20:30', length: 2
    },
    {
      name: hongbaoDetail.senderName, iocn: hongbaoDetail.senderIcon, money: 3,
      url: '789', date: '1月17日 20:30', length: 2
    }]
    console.log(options);
    that.setData({
      hongbaoID: options.id,
      userInfo: app.globalData.userInfo,
      hongbaoDetail:hongbaoDetail
    })
    refersh()
  },
  refersh: function () {
    var that = this;
    wx.request({
      url: that.data.hongbaoUrl,
      data: {
        id: that.data.hongbaoID
      },
      success: function (res) {
        console.log(res)
        that.setData({
          userInfo: app.globalData.userInfo,
          hongbaoDetail: res.data,
        })
      }
      ,
      fail: function (res) {

      }
    })
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var Object = []
    Object.title = "红包乐翻天"
    Object.desc = "新年快乐"
    Object.path = "pages/index/Share/Share?id=" + this.data.hongbaoID
    return Object
  }
})