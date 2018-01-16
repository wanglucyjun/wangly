//app.js
App({
  globalData: {
    sessionInfo: '',
    loginUrl: "http://www.chemchemchem.com/user/do-login",
    url:"http://www.chemchemchem.com/site/init",  //初始化接口url
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
        console.log(that.globalData.sessionInfo)
        if (that.globalData.sessionInfo){
          isLogin=true
          wx.getUserInfo({
            success: function (user) {
              that.globalData.userInfo = user.userInfo
            }
          })
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
                  url: that.globalData.loginUrl,
                  data: {
                    code: res.code
                  },
                  success: function (res) {
                    console.log(res.data)
                    if (res.data.code == '0') {
                      isLogin = true
                      that.globalData.sessionInfo = res.data.data.token
                      wx.setStorageSync('3rd_session', res.data.data.token)
                      wx.getUserInfo({
                        success: function (user) {
                          that.globalData.userInfo = user.userInfo
                        }
                      })
                      cb && typeof cb.success == "function" && cb.success()
                    } else {

                    }
                  }
                  ,
                  fail: function (res) {

                  }
                })
              } else {
                console.log('获取用户登录态失败！' + res.errMsg)
              }
            }
          })
        }
      }
    })
    console.log(isLogin)
    

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
      url: this.globalData.url,
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
      console.log('获取用户登录态成功！')
    }})
    //请求成功

  }

})