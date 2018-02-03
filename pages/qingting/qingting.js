//index.js
//获取应用实例
const app = getApp()

var methods = require('../../utils/methods.js')
var login = require('../../utils/login.js');
Page({
  data: {
    houBaoStyle:1,
    userInfo:[],
    hbType: [],
    shuoming: '小伙伴听完你说的话就能领取赏金',
    Money:'',
    zhifu:'',
    balance:'0.0',
    Number:'',
    fuwufee:'0.0',
    hasRecord:false,
    recording:false,
    filePath:'',
    tempFilePath:'',
    rate:0.01,
    minVal:0.01,
    tips:'录音你想说的内容',
    serverFilePath:''
  },
  
  //事件处理函数
  onLoad: function () {
    var that = this;
    //检查登录状态
    login.checkSession({
      success: function (userInfo) {
        console.log('发送倾听包界面');
        console.log(userInfo);
        app.getBalance();
        that.refresh();
      }
    });

  },
  refresh:function(){
    var that = this;
    var tipArray = methods.getModel(2).tips;
    console.log("tips length " + tipArray.length)
    Math.random() * (tipArray.length - 1)
    var num = Math.round(Math.random() * (tipArray.length - 1) + 0);
    console.log("random " + num)
    that.setData({
      tips: tipArray[num],
      userInfo: login.getSession().userInfo,
      balanceInfo: app.globalData.balanceInfo,
    })

  },
  // 跳转链接

  tomyRecord:function(){
    var that = this;
    wx.navigateTo({
      url: './mRecord/myRecord',
    })

  },
  // 获取页面填入的值
  koulingInput:function(e){
    var that = this;
    console.log(e.detail.value)
    that.setData({
      kouling:e.detail.value,
    })
  },
  MoneyInput: function (e) {
    var that = this;
    console.log(e.detail.value)
    that.setData({
      Money: e.detail.value,
    })
    console.log("acountbalance is " + app.globalData.balanceInfo.allMoney)
    console.log("now money is " + that.data.Money)
    var sendfee = methods.getSendFee(2, that.data.Money)
    console.log(sendfee)
    var chargefee = methods.getChargeFee(2, (that.data.Money - app.globalData.balanceInfo.allMoney))
    if (chargefee < 0) {
      chargefee = 0
    }
   
    console.log("chargefee is " + chargefee)
    var fee = (sendfee + chargefee).toFixed(2);
    var balance = that.data.Money*1 + fee*1
    if (balance > app.globalData.balanceInfo.allMoney) {
      balance = app.globalData.balanceInfo.allMoney
    }
    that.setData({
      fuwufee: fee,
      balance: balance,
      zhifu: that.data.Money + fee - balance
    })
    console.log("now fuwufee is" + that.data.fuwufee)
  
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
    else{
      console.log(that.data.tempFilePath)

      methods.uploadFile({filePath:that.data.tempFilePath,success:function(obj){
        var value = obj
        //console.log()
        console.log("server file path is " + value)
        methods.hongbaoCreate(3, '', '', that.data.Money, that.data.Number, that.data.fuwufee, value)
      }})



    console.log(e.detail.value);
  }
  },

  startRecord:function(){
    var that = this
    console.log("stat record");
    this.setData({
      recording:true
    })
    console.log(this.data.recording);

   wx.startRecord({
     success: function (res) {
       that.setData({
       tempFilePath:res.tempFilePath
     })
     }
   })

  },
 stopRecord:function(){
   var that=this
   console.log("stop record");
   this.setData({recording: false})
    wx.stopRecord({

    })
    that.setData({
      hasRecord:true
    })
 },

  playVoice: function () {
   var that = this
    var filePath=that.data.tempFilePath
   console.log(filePath);
   wx.playVoice({
     filePath: filePath,
   })
  },
  clickexample: function () {
    wx.navigateTo({
      url: '/pages/index/Share/Share?id=347',
    })
  },
  clickhelp: function () {
    wx.navigateTo({
      url: '../mine/help/help',
    })
  }

})
