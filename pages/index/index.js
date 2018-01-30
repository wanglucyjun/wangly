//index.js
//获取应用实例
const app = getApp()
var methods = require('../../utils/methods.js')
const userinfoUrl = require('../../config').userinfoUrl
Page({
  data: {
    houBaoStyle: 1,
    userInfo: [],
    shuoming: '小伙伴摇摇力超过设置武力值领赏金',
    powerset:'60',
    Money: '',
    Number: '',
    fuwufee: '0.0',
    moving: false,
    power:0,
    rate:2,
    //balanceInfo: {},
    accountBalance:'',
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
    for (var i = 0; i < 10; i++) {
      methods.downloadFile('num' + i, 'https://www.chemchemchem.com/audio/num/num' + i + '.mp3')
    }
    methods.downloadFile('kai0', 'https://www.chemchemchem.com/audio/num/kai0.mp3')
    methods.downloadFile('kai1', 'https://www.chemchemchem.com/audio/num/kai1.mp3')
  },
  onShow:function(){
      wx.startAccelerometer({
        
      })
  },
  onHide:function(){
      wx.stopAccelerometer({
        
      })
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
      userInfo: app.globalData.userInfo,
      //balanceInfo: app.globalData.balanceInfo,
    })
    console.log(app.globalData.userInfo)
  },

  //开始摇手机
  yyydata: {
    lastTime : 0,
    lastIndex : 0,
    currentIndex : 0,
    liliang : [],
    saying:[],
  },
  addLiliang:function(liliang) {
    var currentIndex = this.yyydata.lastIndex % 100;
    this.yyydata.liliang[currentIndex] = 0+liliang;
    var newTime= (new Date()).getTime();
    var sum = 0;
    var count = 5
    if (this.yyydata.lastIndex > 5 && (newTime - this.yyydata.lastTime) > 2000) {
      this.yyydata.lastTime = newTime;
      for (var i = 0; i < count; i++) {
        sum += this.yyydata.liliang[(this.yyydata.lastIndex - i) % 100];
      }
      console.log('sum:' + sum + ';lasttime:' + this.yyydata.lastTime)
      this.yyydata.saying=[]
      sum = sum * this.data.rate + '';
      var p = /[0-9]/;
      for (var i = 0; i < sum.length; i++) {
        if (p.test(sum[i])) {
          this.yyydata.saying[i] = 'num' +sum[i]; 
        } else {
          break;
        }
    }}
    this.yyydata.lastIndex++
    return sum;
  },
  sayWord:function(){
    var fileIndex = this.yyydata.saying.shift();
    if(fileIndex!=undefined){
    var fileP = wx.getStorageSync(fileIndex)
    console.log(fileIndex+fileP);
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = fileP
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })

    // wx.playVoice({
    //   filePath: fileP,
    // })
    }
  },
 voiceContent:[],
 startMove:function(){
      var that=this
      that.setData({
        moving:true
      })
      this.yyydata.lastTime = (new Date()).getTime();
      this.yyydata.lastIndex = 5;
      this.yyydata.currentIndex = 5;
      this.yyydata.liliang = [12, 9, 8, 12, 24];
    wx.startAccelerometer({
      success: function (res) {
        console.log("the wuli " + res)
      }
    })
    wx.onAccelerometerChange(function (res) {
      var wuli = 0 + res.x * res.x + res.y * res.y + res.z * res.z
      if (wuli > 2){
        var sum = that.addLiliang(wuli)*1;
        if(sum>10){
          var interv=400
          setTimeout(function () { methods.getSound("kai0"); }, 0);
          setTimeout(function () { that.sayWord(); }, interv);
          setTimeout(function () { that.sayWord(); }, interv*2);
          setTimeout(function () { that.sayWord(); }, interv*3);
        that.setData({
          power: sum.toFixed(2)
          })
        }
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
    })
    //console.log(app.globalData.balanceInfo)
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
    that.setData({
      fuwufee: fee,
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

      methods.hongbaoCreate(1, '', that.data.powerset, that.data.Money, that.data.Number, that.data.fuwufee,'',1)
     
      console.log(e.detail.value);
    }
  },

  clickhelp:function(){
    wx.navigateTo({
      url: '../mine/help/help',
    })
  }

})
