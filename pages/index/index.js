//kouling.js
//获取应用实例
const app = getApp()
var methods = require('../../utils/methods.js')

Page({
  data: {
    houBaoStyle: 1,
    userInfo: [],
    shuoming: '小伙伴摇摇力超过武力值即可领红包',
    wiliset:'60',
    Money: '',
    Number: '',
    fuwufee: 0.0,
    moving: false,
    wulizhi:0,
    rate:1,
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
      if (wuli > 10){
        console.log(wuli)
        that.setData({
          wulizhi: wuli.toFixed(2)*that.data.rate
        })
      }
     
      
    })
   
  },
  // 获取页面填入的值
  wuliInput: function (e) {
    var that = this;
    console.log(e.detail.value)
    that.setData({
      wiliset: e.detail.value,
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
      //停止监听武力值
      wx.stopAccelerometer({})

      methods.hongbaoCreate(that.data.Money, that.data.count, that.data.fuwufee,'',that.data.wuliset)
      wx.navigateTo({
        url: 'Share/share',
      })
      console.log(e.detail.value);
    }
  },

})
