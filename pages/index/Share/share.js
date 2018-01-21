// pages/index/Share/ShareHotMoney.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    userHongbao:{},
    hongbaoUrl:'',
    getHongbaoUrl:'',
    hongbaoDetail: {},
    hongbaoID:'123',
    moving:false
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that  = this;
    var hongbaoDetail = {}
    hongbaoDetail.id = options.id
    hongbaoDetail.senderName = app.globalData.userInfo.nickName
    hongbaoDetail.senderIcon = app.globalData.userInfo.avatarUrl
    hongbaoDetail.state = 1
    hongbaoDetail.allNum = 5
    hongbaoDetail.allMoney = 10
    hongbaoDetail.leftNum = 3
    hongbaoDetail.leftMoney = 6
    hongbaoDetail.type = 1
    hongbaoDetail.content = { question:'哈哈',answer:''}
    hongbaoDetail.list = [{ name: hongbaoDetail.senderName, iocn: hongbaoDetail.senderIcon,money:2,url:'123',date:'1月16日 20:30',length:3},
      { name: hongbaoDetail.senderName, iocn: hongbaoDetail.senderIcon, money: 3,
        url: '456', date: '1月17日 20:30', length: 2
      },
      {
        name: hongbaoDetail.senderName, iocn: hongbaoDetail.senderIcon, money: 3,
        url: '789', date: '1月17日 20:30', length: 2
      }]
    var userHongbao={}
    userHongbao.id = options.id
    userHongbao.text=0
    that.setData({
      userInfo: app.globalData.userInfo,
      hongbaoDetail: hongbaoDetail,
      hongbaoID: options.id,
      userHongbao: userHongbao
    })
    that.data.userHongbao.id = that.data.hongbaoID
    //根据id查询红包详情
    console.log(options.id)
  },
  toshareChat:function(){
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("onShow")
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("onPullDownRefresh");
    refersh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  refersh:function(){
    var that = this;
    wx.request({
      url: that.data.hongbaoUrl,
      data: {
        id: that.data.hongbaoID
      },
      success: function (res) {
        console.log(res)
        that.setData({
          userInfo: app.globalData.userInfo,
          hongbaoDetail: res.data,
        })
      }
      ,
      fail: function (res) {

      }
    })
  },
  startRecord: function () {
    var that = this
    console.log("stat record");
    wx.startRecord({
      success: function (res) {
        that.data.userHongbao.file = res.tempFilePath
        that.data.userHongbao.text=''
      }
    })

  },
  stopRecord: function () {
     console.log("stop record");
     wx.stopRecord({
      success: function (res) {
        this.getHongbao()
      }
    })
  },
  getHongbao:function(){
    console.log("getHongbao");
    var that = this
    app.checkSession({
      success: function () {
        //此处领红包
        wx.request({
          url: that.data.getHongbaoUrl,
          data: that.userHongbao,
          success: function (res) {
            //显示领取多少红包
            that.refersh()
          }
          ,
          fail: function (res) {
            
          }
        })
      }
    })
  },

  playVoice: function (obj) {
    var that = this
    var filePath = obj.target.id
    console.log(obj);
    console.log(obj.target.id)
    wx.playVoice({
      filePath: filePath,
      success:function(){
        if (that.data.hongbaoDetail.type == 3 && that.data.hongbaoDetail.state==1){
          that.data.userHongbao.file = ''
          that.data.userHongbao.text = ''
          getHongbao()
        }
      }
    })
  },
  //开始摇手机
  startMove: function () {
    var that = this
    that.setData({
      moving: true
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
      if (wuli > 10) {
        console.log(wuli)
        that.data.userHongbao.file = ''
        that.data.userHongbao.text = wuli.toFixed(2)
        that.setData({
          userHongbao: that.data.userHongbao
        })
      }
      if (wuli > that.data.hongbaoDetail.content.question){
        getHongbao()
      }


    })

  },
  againSend:function(){
   
    var that=this
    
    var url=''
    if (that.data.hongbaoDetail.type == 1){
      url ='../../yaoyiyao/yaoyiyao'
    }
    if (that.data.hongbaoDetail.type == 2) {
      url = '../../kouling/kouling'
    }
    if (that.data.hongbaoDetail.type == 3) {
      url = '../../index/index'
    }
    console.log(url)
    wx.switchTab({
      url: url,
      fail:function(msg){
        console.log(msg)
      }
    })
  },
  toShare:function(){
    wx.navigateTo({
      url: 'ShareHotMoney?id=456',
    })
  }
})