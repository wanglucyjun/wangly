//index.js
//获取应用实例
const app = getApp()

var methods = require('../../utils/methods.js')

Page({
  data: {
    houBaoStyle:1,
    userInfo:[],
    hbType: [],
    shuoming1: '好友听完你说的话就能领取赏金',
    shuoming2:'小伙伴们说对口令就能获得随即打赏',
    shuoming3: '小伙伴摇摇力超过武力值即可领红包',
    Money:'',
    Number:'',
    fuwufee:0.0,
    hasRecord:false,
    recording:false,
    filePath:'',
    tempFilePath:'',
    rate:0.01,
    minVal:0.01,
    tips:'长按输入你想说的内容',
    NetUrl:'http://www.chemchemchem.com/file/201801212303/40affe2a9c37c223dfcca82339b8aee2.silk',
    serverFilePath:''
  },
  
  //事件处理函数
  onLoad: function () {
    var that = this;
    var tipArray = methods.getModel(2).tips;
    console.log("tips length " + tipArray.length)
    Math.random() * (tipArray.length-1)
    var num = Math.round(Math.random() * (tipArray.length-1) + 0);
    console.log("random "+num)
    that.setData({
      tips: tipArray[num]
    })
    
    wx.getUserInfo({
      success:function(user){
        console.log(user)
        that.setData({
          userInfo:user.userInfo,
        })
      }
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
  MoneyInput:function(e){
    var that = this;
   var fuwufee=methods.getChargeFee(2)
    console.log(e.detail.value)
    that.setData({
      Money: e.detail.value,
      fuwufee: fuwufee
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
    else{
      var value = wx.getStorageSync('voiceTempFile')

      //console.log("server file path is " + that.data.serverFilePath)

      methods.hongbaoCreate(3, '', '', that.data.Money, that.data.Number, that.data.fuwufee, value)
    wx.navigateTo({
      url: '../index/Share/Share',
    })
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
   methods.uploadFile(filePath)
  
  },

  //播放网络返回的地址
  playNetVoice:function(){
    var that=this
   //var filePath=methods.downloadFile(that.data.NetUrl)
  console.log("qingting "+that.data.NetUrl)
   methods.playNetVoice(that.data.NetUrl)

  }
})
