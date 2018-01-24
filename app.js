//app.js
const loginUrl = require('./config').loginUrl
const initUrl = require('./config').initUrl
const updateUrl = require('./config').updateUrl
App({
  globalData: {
    sessionInfo: '',
    needInfo:0,
    userInfo: [],
    chargeFee:[],
    dealFee:[],
    withdrawFee:[],
    hbType:[],
  },
  onLoad:function(){
    console.log("App onLoad")
  },
  checkSession: function (cb){
    var that = this
    var isLogin=false;
    wx.checkSession({
      success: function () {
        //session 未过期，并且在本生命周期一直有效
        that.globalData.sessionInfo = wx.getStorageSync('3rd_session') || []
        console.log("sessioninfo is "+that.globalData.sessionInfo)
        if (that.globalData.sessionInfo && that.globalData.sessionInfo !=''){
          isLogin=true
          that.getUserInfo()
          cb&&typeof cb.success == "function" && cb.success()
        }
      },
      fail: function () {
        //登录态过期
        isLogin=false
      },
      complete:function(){
        if (!isLogin){
          //重新登录
          // 登录
          wx.login({
            success: res => {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              if (res.code) {
                //发起网络请求
                wx.request({
                  url: loginUrl,
                  data: {
                    code: res.code
                  },
                  success: function (res) {
                    console.log(res.data)
                    if (res.data.code == '0') {
                      isLogin = true
                      console.log(res.data.data)
                      that.globalData.sessionInfo = res.data.data.token
                      that.globalData.needInfo = res.data.data.needInfo
                      that.getUserInfo()
                      wx.setStorageSync('3rd_session', res.data.data.token)
                      cb && typeof cb.success == "function" && cb.success()
                    } else {
                      wx.showModal({
                        title: '提示',
                        content: '登录失败'
                      })
                    }
                  }
                  ,
                  fail: function (res) {
                    wx.showModal({
                      title: '提示',
                      content: '登录失败'
                    })
                  }
                })
              } else {
                //console.log('获取用户登录态失败！' + res.errMsg)
                wx.showModal({
                  title: '提示',
                  content: '登录失败'
                })
              }
            }
          })
        }

      }
    })
    console.log(isLogin)
  },
  getUserInfo:function(){
    var that=this
    wx.getUserInfo({
      success: function (user) {
        if (that.globalData.needInfo == 1) {
          var userInfo = user.userInfo
          userInfo.token = that.globalData.sessionInfo
          wx.request({
            url: updateUrl,
            data: userInfo,
            success: function (res) {

            }
            ,
            fail: function (res) {
              wx.showModal({
                title: '提示',
                content: '登录失败'
              })
            }
          })
        }
        that.globalData.userInfo = user.userInfo
        if (that.userInfoReadyCallback) {
          console.log(user.userInfo)
          that.userInfoReadyCallback()
        }
      }
    })
  },
  analyzeData:function(res){
    for (var idx in that.globalData.hbType.subjects){
        var subject=hyType.subjects[idx];
        var title=subject.title;
        console.log(title)
      }
  },
  onLaunch: function () {
    var that = this
    console.log("App OnLaunch")
    wx.request({
      url:initUrl,
      success: function (res) {
        console.log(res.data),
          that.globalData.chargeFee = res.data.data.chargeFee,
          that.globalData.dealFee = res.data.data.dealFee,
          that.globalData.withdrawFee = res.data.data.withdrawFee,
          that.globalData.hbType = res.data.data.hbType,
          console.log(res.data.data.hbType.length)
      },
      fail: function (res) {
        console.log(res.data)
      },
    })

    //检查登录状态
    that.checkSession({success:function(){
      console.log('获取用户登录态成功！' + that.globalData.sessionInfo)
    }})
    //请求成功

  }

})