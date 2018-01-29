// pages/index/Share/ShareHotMoney.js
var app = getApp();
var methods = require('../../../utils/methods.js')
const config = require('../../../config')
var map=new Map();


Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    userHongbao:{},
    hongbaoDetail: {},
    hongbaoID:'123',
    moving:false
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //临时数据
    var hongbaoDetail = {}

    var userHongbao = {}
    userHongbao.id = options.id
    userHongbao.text = 0
    //临时数据
    that.setData({
      userInfo: app.globalData.userInfo,
      hongbaoDetail: hongbaoDetail,
      hongbaoID: options.id,
      userHongbao: userHongbao
    })

    if (app.globalData.userInfo.nickName) {
      console.log('index0')
      this.refersh()
    } else {
      console.log('index1')
      app.userInfoReadyCallback = res => {
        this.refersh()
      }
    }

    

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
    this.refersh()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
  sayget:function(){
    var fileP = wx.getStorageSync('kai1')
    console.log("fileP")
    console.log(fileP)
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
  },
  refersh:function(){
    console.log('refersh')
    var that = this;
    methods.downloadFile('kai1', 'https://www.chemchemchem.com/audio/num/kai1.mp3')
    wx.request({
      url: config.hongbaoDetailUrl,
      data: {
        id: that.data.hongbaoID,
        token: app.globalData.sessionInfo
      },
      success: function (res) {
        console.log(res)

        
        that.setData({
          userInfo: app.globalData.userInfo,
          hongbaoDetail: res.data.data,
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
        console.log(that.data.userHongbao.file);
        that.data.userHongbao.text=''

        methods.uploadFile({
          filePath: that.data.userHongbao.file, success: function (file) {
            that.data.userHongbao.file = file
            that.getHongbao()
          }
        })
      }
    })

  },
  stopRecord: function () {
    var that = this
     console.log("stop record");
     wx.stopRecord({
      success: function (res) {
        console.log(that.data.userHongbao.file);
       
        
      }
    })
  },
  getHongbao:function(){
    console.log("getHongbao");
    var that = this
    if (that.data.hongbaoDetail.state == 1 && that.data.hongbaoDetail.hadSend == 0) {

    app.checkSession({
      success: function () {
        that.data.userHongbao.token = app.globalData.sessionInfo
        //此处领红包
        wx.request({
          url: config.hongbaoGetUrl,
          data: that.data.userHongbao,
          success: function (res) {
            console.log(res)
            if(res.data.code==0){
              wx.showModal({
                title: '提示',
                content: '您领取了'+res.data.data.money
              })
              that.sayget()
            }else{
              wx.showModal({
                title: '提示',
                content: res.data.message
              })
            }
            //显示领取多少红包
            that.refersh()
          }
          ,
          fail: function (res) {
            
          }
        })
      }
    })
    
    }
  },

  playVoice: function (obj) {
    var that = this
    //var filePath = obj.currentTarget.id
    console.log(obj)
    console.log(obj.currentTarget.dataset.url)
    var filePath = map.get(obj.currentTarget.dataset.url)
    if (filePath){
      wx.playVoice({
        filePath: filePath,
        complete: function () {
          if (that.data.hongbaoDetail.type == 3 
          && that.data.hongbaoDetail.state == 1
          &&that.data.hongbaoDetail.hadSend==0) {
            that.data.userHongbao.file = ''
            that.data.userHongbao.text = ''
            that.getHongbao()
          }
        }
      })
    }else{
      wx.downloadFile({
        url: obj.currentTarget.dataset.url, //仅为示例，并非真实的资源
        success: function (res) {
          console.log(res.tempFilePath);
          map.set(obj.currentTarget.dataset.url, res.tempFilePath);
          wx.playVoice({
            filePath: res.tempFilePath,
            complete: function () {
              if (that.data.hongbaoDetail.type == 3 && that.data.hongbaoDetail.state == 1 && that.data.hongbaoDetail.hadSend == 0) {
                that.data.userHongbao.file = ''
                that.data.userHongbao.text = ''
                that.getHongbao()
              }
            }
          })
        }
      })
    }

    

    

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
        that.getHongbao()
        wx.stopAccelerometer({})
      }


    })

  },
  againSend:function(){
   
    var that=this
    
    var url=''
    if (that.data.hongbaoDetail.type == 1){
      url ='../../index/index'
    }
    if (that.data.hongbaoDetail.type == 2) {
      url = '../../kouling/kouling'
    }
    if (that.data.hongbaoDetail.type == 3) {
      url = '../../qingting/qingting'
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
      url: 'ShareHotMoney?id='+this.data.hongbaoID,
    })
  },
  gotoMine:function(){
    wx.switchTab({
      url: '../../mine/mine',
    })
  }
})