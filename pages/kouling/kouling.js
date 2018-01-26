//kouling.js
//获取应用实例
const app = getApp()
var methods = require('../../utils/methods.js')

Page({
  data: {
    houBaoStyle: 1,
    userInfo: [],
    shuoming1: '小伙伴们说对口令就能获得随机赏金',
    kouling: '',
    Money: '',
    Number: '',
    fuwufee: 0.0,
    tips:"新的一年大吉大利"
  },

  onLoad: function () {

    if (app.globalData.userInfo.nickName) {
      console.log('index0')
      this.initPage()
    } else {
      console.log('index1')
      app.userInfoReadyCallback = res => {
        this.initPage()
      }
    }
    
  },
  initPage: function () {
    var that = this;
    var tipArray = methods.getModel(1).tips;
    console.log("tips length " + tipArray.length)
    Math.random() * (tipArray.length - 1)
    var num = Math.round(Math.random() * (tipArray.length - 1) + 0);
    console.log("random " + num)
    that.setData({
      userInfo: app.globalData.userInfo,
      tips: tipArray[num],
      kouling: tipArray[num]
    })
  },
  // 跳转链接

  tomyRecord: function () {
    var that = this;
    wx.navigateTo({
      url: './mRecord/myRecord',
    })

  },
  // 获取页面填入的值
  koulingInput: function (e) {
    var that = this;
    console.log(e.detail.value)
    that.setData({
      kouling: e.detail.value,
    })
  },
  MoneyInput: function (e) {
    var that = this;
    console.log(e.detail.value)
    that.setData({
      Money: e.detail.value,
      fuwufee:methods.getChargeFee(1),
    })
  },
  NumberInput: function (e) {
    var that = this;
    console.log(e.detail.value)
    that.setData({
      Number: e.detail.value,
    })
  },

  toShare: function (e) {
    var that = this;
    console.log(e.detail.value)
    if (this.data.Money == '') {

      wx.showModal({
        title: '提示',
        content: '请先输入金额',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }

    else if (this.data.Number == '') {
      wx.showModal({
        title: '提示',
        content: '请输入红包个数',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    else {
      console.log('fdjkdfslkj');
      if (that.data.kouling==''){
        that.data.kouling = that.data.tips
      }
      console.log(that.data.kouling);
      methods.hongbaoCreate(2,that.data.kouling,'',that.data.Money, that.data.Number, that.data.fuwufee,'','')
     
    }
  }

})
