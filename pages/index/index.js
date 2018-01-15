//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    houBaoStyle:1,
    userInfo:[],
    chargeFee:[],
    dealFee: [],
    withdrawFee: [],
    hbType: [],
    shuoming1: '好友听完你说的话就能领取赏金',
    shuoming2:'小伙伴们说对口令就能获得随即打赏',
    kouling: '',
    Money:'',
    Number:'',
    fuwufee:0.0,
    hasRecord:false,
    recording:false,
    playing :false ,
    filePath:'',
    chargeParam:0,
    dealParam:0,
    numParam:0,
    withdrawParam:0,
    sn:"code",
    rate:0.01,
    minVal:0.01,
    tips:''
  },
  
  //事件处理函数
  onLoad: function () {
    var that = this;
    var tipArray = app.globalData.hbType[0].tips;
    console.log("tips length "+tipArray.length)
    for(var i = 0; i< tipArray.length+1; i++) {
      that.setData({
        tips:tipArray[i] 
      })
      console.log(that.data.tips)
    }
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
   
    console.log(e.detail.value)
    that.setData({
      Money: e.detail.value,
      fuwufee: that.getChargeFee()
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
    wx.request({
      url:"http://www.chemchemchem.com/",
      data: {
        kouling: this.data.kouling,
        money: this.data.Money,
        count: this.data.Number,
        fuwufei:this.data.fuwufee,
      },
    })
    wx.navigateTo({
      url: 'Share/ShareHotMoney',
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
   console.log("stop record");
   this.setData({recording: false})
    wx.stopRecord({

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

  //费用相关
  getChargeFee:function(){
    var that = this
    that.getModel();
    var tempparam = app.globalData.chargeFee[that.data.chargeParam]
  
    if (tempparam.isFee=="0"){
      this.setData({
       fuwufee:0.00  
      })
      return that.data.fuwufee
    }
    else{
      that.setData({
        rate:tempparam.rate,
        minVal:tempparam.minVal,
      })
     
      console.log("rate is " + this.data.rate);
      console.log("rate is " + this.data.Money*this.data.rate);
      return that.data.Money*rate;
    }
  },
  //获取返回红包类型的模版
  getModel:function(){
    var temdata = app.globalData.hbType[0]
    this.setData({
    chargeParam:temdata.chargeParam,
    dealParam: temdata.dealParam,
    withdrawParam:temdata.withdrawParam,
    sn: temdata.sn,
    })
    console.log("sn is "+this.data.sn);
   
  }
 
})
