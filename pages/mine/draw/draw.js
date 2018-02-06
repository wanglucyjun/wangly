const app = getApp()
const config = require('../../../config')
var methods = require('../../../utils/methods.js')
var login = require('../../../utils/login.js');
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
    var that=this
    //检查登录状态
    login.checkSession({
      success: function (userInfo) {
        console.log('领取红包界面');
        console.log(userInfo);
        that.refresh();
      }
    });
    
  },
  refresh: function(){
    var that = this;
    app.getBalance()
    that.setData({
      userInfo: login.getSession().userInfo,
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
   
    } 
  
    else{
      
      var drawfee = methods.getWithdrawFee(0, e.detail.value)*1
      var actualfee = e.detail.value * 1
      var fee = (actualfee + drawfee).toFixed(2);
      console.log(fee)
      if (fee > parseFloat(that.data.userHongbao.allMoney) ) {
        actualfee = that.data.userHongbao.allMoney-drawfee
      }
      actualfee = actualfee.toFixed(2);
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
    console.log("money is "+that.data.money)
    console.log(that.data.userHongbao.oneTimesLimit)
    if (that.data.money - that.data.userHongbao.minWithdrawMoney<0){
      wx.showModal({
        title: '提示',
        // content: '账号余额大于可以提现哦',
        content: '最小提现金额为' + that.data.userHongbao.minWithdrawMoney+'元',
      })
    }
    else if ((that.data.money-that.data.userHongbao.oneTimesLimit)<=0){
     wx.showModal({
       title: '提示',
      // content: '账号余额大于可以提现哦',
       content: '账号余额大于' + that.data.userHongbao.oneTimesLimit+'元才可以提现哦',
     })
  }
  else{
    login.checkSession({
      success: function () {
        wx.request({
          url: config.hongbaoDrawUrl,
          data: {
            token: login.getSession().session.token,
            money:that.data.money
          },
          success: function (res) {
            console.log(res)
            if(res.data.code='0'){
            wx.showModal({
              title: '提示',
              content: '提现申请成功，1～5个工作日到账',
            })
            }
            else{
              wx.showModal({
                title: '提示',
                content: res.data.message,
              })
            }
          }
          ,
          fail: function (res) {
              wx.showToast({
                title: '提现失败，请稍后再试',
              })
          }
        })
      }
    })
  }
  }
})