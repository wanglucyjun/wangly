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
    hongbaoDetail: {},
    hongbaoStyle:1,
    hongbaoID:'123'
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that  = this;
    var hongbaoDetail = {}
    hongbaoDetail.id='123'
    hongbaoDetail.senderName = app.globalData.userInfo.nickName
    hongbaoDetail.senderIcon = app.globalData.userInfo.avatarUrl
    hongbaoDetail.state = 1
    hongbaoDetail.allNum = 5
    hongbaoDetail.allMoney = 10
    hongbaoDetail.leftNum = 3
    hongbaoDetail.leftMoney = 6
    hongbaoDetail.type = 3
    hongbaoDetail.content = { question:'哈哈',answer:''}
    hongbaoDetail.list = [{ name: hongbaoDetail.senderName, iocn: hongbaoDetail.senderIcon,money:2,url:'123',date:'1月16日 20:30',length:3},
      { name: hongbaoDetail.senderName, iocn: hongbaoDetail.senderIcon, money: 3,
        url: '456', date: '1月17日 20:30', length: 2
      },
      {
        name: hongbaoDetail.senderName, iocn: hongbaoDetail.senderIcon, money: 3,
        url: '789', date: '1月17日 20:30', length: 2
      }]

    that.setData({
      userInfo: app.globalData.userInfo,
      hongbaoDetail: hongbaoDetail
    })
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
    //refersh(that.data.hongbaoID)

    this.setData({
      userInfo: app.globalData.userInfo,
      hongbaoDetail: hongbaoDetail
    })
    console.log(hongbaoDetail)
    console.log(this.data.userInfo)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var Object=[]
    Object.title="包一抢"
    Object.desc="新年快乐"
    Object.path ="pages/index/share/share?id=123"
    return Object
  },
  refersh:function(id){
    var that = this;
    wx.request({
      url: that.data.hongbaoUrl,
      data: {
        id: options.id
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
        that.data.userHongbao.tempPath = res.tempFilePath
      }
    })

  },
  stopRecord: function () {
    console.log("stop record");
    wx.stopRecord({
      success: function (res) {
        //此处领红包
      }
    })
  },

  playVoice: function (obj) {
    var that = this
    var filePath = that.data.userHongbao.tempPath
    console.log(obj);
    console.log(obj.target.id)
    wx.playVoice({
      filePath: filePath,
    })
  }
})