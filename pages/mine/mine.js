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
   var that = this;
   var userInfo = app.globalData.userInfo;
   that.setData({
     userInfo: app.globalData.userInfo,
   })
  //  var receivedHongbao={}
  //  receivedHongbao.receivedMoney=10
  //  receivedHongbao.receivedNum=10
  //  receivedHongbao.page=1
  //  receivedHongbao.list=[{id:'1',name:'龙',icon:'',money:1,title:'倾听',type:1,date:'2017年6月12日'},
  //    { id: '2', name: '虎', icon: '', money: 1, title: '倾听', type: 1, date: '2017年6月12日' },
  //    { id: '3', name: '虎', icon: '', money: 1, title: '倾听', type: 1, date: '2017年6月12日' },
  //    { id: '4', name: '虎', icon: '', money: 1, title: '倾听', type: 1, date: '2017年6月12日' }]
  //  var sendedHongbao = {}
  //  sendedHongbao.sendedMoney = 10
  //  sendedHongbao.sendedNum = 10
  //  sendedHongbao.page = 1
  //  sendedHongbao.list = [{ id: '1', title: '倾听', type: 1, date: '2017年6月12日',allMoney:10,allNum:10,leftMoney:5,leftNum:5 },
  //    { id: '2', title: '摇一摇', type: 1, date: '2017年6月12日', allMoney: 10, allNum: 10, leftMoney: 5, leftNum: 5 }]
  //   that.setData({
  //     sendedHongbao: sendedHongbao,
  //     receivedHongbao: receivedHongbao
  //   })
    this.refresh()
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
    this.refresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
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
        //res.data.data.page = that.data.receivedHongbao.page + 1
        if (res.data.data){
          that.setData({
            receivedHongbao: res.data.data
          })
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
    wx.request({
      url: config.hongbaoGetBalanceUrl,
      data: {
        token: app.globalData.sessionInfo
      },
      success: function (res) {
        console.log(res)
        that.setData({
          userInfo: app.globalData.userInfo,
          userHongbao: res.data.data,
        })
      }
      ,
      fail: function (res) {

      }
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