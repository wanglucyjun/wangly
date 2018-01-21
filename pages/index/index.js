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
    kouling: '',
    Money:'',
    Number:'',
    fuwufee:0.0,
    hasRecord:false,
    recording:false,
    playing :false ,
    filePath:'',
    tempFilePath:'',
    chargeParam:0,
    dealParam:0,
    numParam:0,
    withdrawParam:0,
    sn:"code",
    rate:0.01,
    minVal:0.01,
    tips:'长按输入你想说的内容',
    NetUrl:'http://www.chemchemchem.com/file/201801201744/178f12143291d5ebe3117c0639d10992.silk'
  },
  
  //事件处理函数
  onLoad: function () {
    var that = this;
    var tipArray = app.globalData.hbType[0].tips;
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
   var fuwufee=methods.getChargeFee()
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
      methods.uploadFile()
      methods.hongbaoCreate(that.data.Money,that.data.count,that.data.fuwufee)
    wx.navigateTo({
      url: 'Share/Share',
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
    //that.saveFileToLocal()
   methods.uploadFile(filePath)
  //methods.downloadFile()
  },

  //播放网络返回的地址
  playNetVoice:function(){
   console.log("local file address "+this.data.filePath)
   wx.playVoice({
     filePath:this.data.filePath,
   })
  }
  
 
  
})
