//index.js
//获取应用实例
const app = getApp();
var methods = require('../../utils/methods.js');
var accelerometer = require('../../utils/accelerometer.js');
var login = require('../../utils/login.js');
Page({
  data: {
    houBaoStyle: 1,
    userInfo: [],
    shuoming: '小伙伴们摇摇超过武力值领赏金',
    powerset:'60',
    Money: '',
    zhifu: '',
    balance: '0.0',
    Number: '',
    fuwufee: '0.0',
    moving: false,
    power:0,
    rate:2,
    //balanceInfo: {},
    accountBalance:'',
  },
  /**
     * 生命周期函数--监听页面显示
     */
  onShow: function () {
    console.log("onShow");
    var that=this;
    that.setData({
      moving:true
    });
    that.startMove();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var that = this;
    that.setData({
      moving: false
    });
    accelerometer.stopMove();
    
  },
  //事件处理函数
  onLoad: function () {
    var that=this;
    //检查登录状态
    login.checkSession({
      success: function (userInfo) {
        console.log('发送摇摇包界面');
        console.log(userInfo);
        app.getBalance();
        that.refresh();
      }
    });
  },
  refresh:function(){
    var that = this;
    var tipArray = methods.getModel(0).tips;
    var num = Math.round(Math.random() * (tipArray.length - 1) + 0);
     that.setData({
      tips: tipArray[num],
      userInfo: login.getSession().userInfo,
      balanceInfo: app.globalData.balanceInfo,
    })
    console.log(login.getSession().userInfo)
  },
  startMove: function () {
    var that=this;
      accelerometer.startMove(function(sum){
        console.log("sum");
        console.log(sum);
      that.setData({
          power: sum.toFixed(2),
          powerset:sum.toFixed(2)
      });
    });
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
    })
    console.log(app.globalData.balanceInfo)
    console.log("acountbalance is " + app.globalData.balanceInfo.allMoney)
    console.log("now money is "+that.data.Money)
    var sendfee = methods.getSendFee(0, that.data.Money)
    console.log(sendfee)
    var chargefee = methods.getChargeFee(0, (that.data.Money - app.globalData.balanceInfo.allMoney))
    if(chargefee<0){
      chargefee=0
    }
    console.log("chargefee is "+chargefee)
    var fee = (sendfee + chargefee).toFixed(2);
    var balance = that.data.Money * 1 + fee * 1
    if (balance > app.globalData.balanceInfo.allMoney) {
      balance = app.globalData.balanceInfo.allMoney
    }
    that.setData({
      fuwufee: fee,
      balance: balance,
      zhifu: that.data.Money + fee - balance
    })
    console.log("now fuwufee is"+that.data.fuwufee)
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

      methods.hongbaoCreate(1, '', that.data.powerset, that.data.Money, that.data.Number, that.data.fuwufee,'','')
     
      console.log(e.detail.value);
    }
  },
  clickexample:function(){
    wx.navigateTo({
      url: '/pages/index/Share/Share?id=344',
    })
  },
  clickhelp:function(){
    wx.navigateTo({
      url: '../mine/help/help',
    })
  }

})
