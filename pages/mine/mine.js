// pages/mine/mine.js
var app = getApp();
const config = require('../../config')
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
    if (app.globalData.userInfo.nickName) {
      console.log('index0')
      this.refresh()
    } else {
      console.log('index1')
      app.userInfoReadyCallback = res => {
        this.refresh()
      }
    }
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
    console.log("onPullDownRefresh")
    this.refresh()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("onReachBottom")
    if (this.data.mineRecod==1){
      this.getSendedHongbao();
    } else if (this.data.mineRecod == 2){
      this.getReceivedHongbao();
    }

  },
  getReceivedHongbao:function(){
    
    var that = this;
    console.log(that.data.receivedHongbao.page)
    wx.request({
      url: config.hongbaoReceivedUrl,
      data: {
        token: app.globalData.sessionInfo,
        page: that.data.receivedHongbao.page + 1
      },
      success: function (res) {
        console.log(res)
        if (res.data.data && res.data.data.list.length > 0) {

          that.data.receivedHongbao.page = that.data.receivedHongbao.page + 1
          if (that.data.receivedHongbao.page == 1) {
            //res.data.data.page = that.data.sendedHongbao.page + 1
            that.setData({
              receivedHongbao: res.data.data
            })
          } else {
            var list = that.data.receivedHongbao.list
            console.log(that.data.receivedHongbao)
            that.data.receivedHongbao.list = list.concat(res.data.data.list)

            that.setData({
              receivedHongbao: that.data.receivedHongbao
            })
          }
        }
        
      }
      ,
      fail: function (res) {

      }
    })
  },
  getSendedHongbao: function() {
    var that = this;
    wx.request({
      url: config.hongbaoSendedUrl,
      data: {
        token: app.globalData.sessionInfo,
        page: that.data.sendedHongbao.page + 1
      },
      success: function (res) {
        console.log(res)
        if (res.data.data && res.data.data.list.length>0){
          
          that.data.sendedHongbao.page = that.data.sendedHongbao.page+1
          if (that.data.sendedHongbao.page==1){
            //res.data.data.page = that.data.sendedHongbao.page + 1
            that.setData({
              sendedHongbao: res.data.data
            })
          }else{
            var list= that.data.sendedHongbao.list
            console.log(that.data.sendedHongbao)
            that.data.sendedHongbao.list=list.concat(res.data.data.list)
            
            that.setData({
              sendedHongbao: that.data.sendedHongbao
            })
          }
        }
      }
      ,
      fail: function (res) {

      }
    })
  },
  refresh:function(){
    var that = this;
    app.getBalance()
    that.setData({
      userInfo: app.globalData.userInfo,
      userHongbao: app.globalData.balanceInfo,
    })
    that.data.sendedHongbao.page=0
    console.log("that.data.receivedHongbao.page")
    that.data.receivedHongbao.page=0
    
    console.log(that.data.receivedHongbao.page)
    this.getReceivedHongbao()
    this.getSendedHongbao()
  },
  toShare:function(obj){
    var that = this
    //var filePath = obj.currentTarget.id
    console.log(obj)
    console.log(obj.currentTarget.dataset.hongbaoid)
    wx.navigateTo({
      url: '/pages/index/Share/Share?id=' + obj.currentTarget.dataset.hongbaoid,
    })
  },
  /**
   * 提现交互
   */
  getMoney:function(){
    wx.navigateTo({
      url: 'draw/draw',
    })
  },
  showHelp:function(){
    wx.navigateTo({
      url: 'help/help',
    })
  }
})