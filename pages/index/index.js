//index.js
//获取应用实例
const app = getApp()
var methods = require('../../utils/methods.js')

Page({
  data: {
    houBaoStyle: 1,
    userInfo: [],
    shuoming: '小伙伴摇摇力超过武力值即可领红包',
    powerset:'60',
    Money: '',
    Number: '',
    fuwufee: 0.0,
    moving: false,
    power:0,
    rate:2,
  },

  //事件处理函数
  onLoad: function () {
    if (app.globalData.userInfo.nickName){
      console.log('index0')
       this.initPage()
    }else{
      console.log('index1')
      app.userInfoReadyCallback = res => {
        this.initPage()
      }
    }
    
  },
  initPage:function(){
    var that = this;
    var tipArray = app.globalData.hbType[0].tips;
    console.log("tips length " + tipArray.length)
    Math.random() * (tipArray.length - 1)
    var num = Math.round(Math.random() * (tipArray.length - 1) + 0);
    console.log("random " + num)
    that.setData({
      tips: tipArray[num],
      userInfo: app.globalData.userInfo
    })
    console.log(app.globalData.userInfo)
  },

  //开始摇手机
  startMove:function(){
      var that=this
      that.setData({
        moving:true
      })
    wx.startAccelerometer({
      success: function (res) {
        console.log("the wuli " + res)
      }
    })
    wx.onAccelerometerChange(function (res) {
      // console.log(res.x+',')
      // console.log(res.y + ',')
      // console.log(res.z + ',')
      var wuli = 0 + res.x * res.x + res.y * res.y + res.z * res.z
      if (wuli > 5){
        console.log(wuli)
        that.setData({
          power: wuli.toFixed(2)*that.data.rate
        })
      }
     
      
    })
   
  },
  // 获取页面填入的值
  powerInput: function (e) {
    var that = this;
    console.log(e.detail.value)
    that.setData({
      powerset: e.detail.value,
    })
  },
  MoneyInput: function (e) {
    var that = this;
    console.log(e.detail.value)
    that.setData({
      Money: e.detail.value,
      fuwufee: methods.getChargeFee(0),
    })
  },
  NumberInput: function (e) {
    var that = this;
    console.log(e.detail.value)
    that.setData({
      Number: e.detail.value,
    })
  },

  toShare:function(e) {
    var that = this;
    console.log(e.detail.value)
    if(this.data.Money==''){

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

    else if(this.data.Number==''){
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
      //停止监听武力值
      wx.stopAccelerometer({})

      methods.hongbaoCreate(1, '', that.data.powerset, that.data.Money, that.data.Number, that.data.fuwufee,'',1)
     
      console.log(e.detail.value);
    }
  },

})
