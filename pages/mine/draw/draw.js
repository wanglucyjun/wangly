const app = getApp()
const config = require('../../../config')
var methods = require('../../../utils/methods.js')
// pages/mine/draw.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    userHongbao: {},
    withdrawFee: {},
    money:0.00,
    actualfee: 0.00,
    drawfee: 0.00
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
  refresh: function(){
    var that = this;
    app.getBalance()
    app.globalData.balanceInfo.withdrawableMoney=10.00
    that.setData({
      userInfo: app.globalData.userInfo,
      userHongbao: app.globalData.balanceInfo,
      withdrawFee: app.globalData.withdrawFee,
      money: 0.00
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
    if (e.detail.value > that.data.userHongbao.withdrawableMoney){
      wx.showModal({
        title: '提示',
        content: '提现金额不能大于可用余额'
    })
    return ''
    }else{
      
      var drawfee = methods.getWithdrawFee(0, e.detail.value)*1
      var actualfee = e.detail.value*1
      var fee = (actualfee + drawfee).toFixed(2);
      console.log(fee)
      if (fee > parseFloat(that.data.userHongbao.allMoney) ) {
        actualfee = that.data.userHongbao.allMoney-drawfee
      }
      console.log(actualfee)
      that.setData({
        money: e.detail.value,
        actualfee: actualfee,
        drawfee: drawfee
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
          url: config.hongbaoDrawUrl,
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