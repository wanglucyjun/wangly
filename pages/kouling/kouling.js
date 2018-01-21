//kouling.js
//获取应用实例
const app = getApp()

Page({
  data: {
    houBaoStyle: 1,
    userInfo: [],
    shuoming1: '小伙伴们说对口令就能获得随即打赏',
    kouling: '',
    Money: '',
    Number: '',
    fuwufee: 0.0,
    hasRecord: false,
    recording: false,
    playing: false,
  },

  //事件处理函数
  ChangeTab: function (e) {
    var that = this;
    console.log("currentTab")
    var currentTab = e.currentTarget.dataset.id;
    that.setData({
      houBaoStyle: currentTab,
    })
  },
  onLoad: function () {
    var that = this;
    wx.getUserInfo({
      success: function (user) {
        console.log(user)
        that.setData({
          userInfo: user.userInfo,
        })
      }
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
      fuwufee: e.detail.value * 0.02,
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
    wx.request({
      url: "http://www.baidu.test",
      data: {
        kouling: this.data.kouling,
        money: this.data.Money,
        count: this.data.Number,
        fuwufei: this.data.fuwufee,
      },
    })
    console.log(e.detail.value);
  },

  huatong: function () {
    wx.startRecord({

    })
  },
  stoprecord: function () {
    wx.stopRecord();
  }

})
