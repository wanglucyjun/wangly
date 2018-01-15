//app.js
App({
  globalData: {
    userInfo: [],
    sessionInfo: '',
      url:"http://www.chemchemchem.com/site/init",  //初始化接口url
      userInfo: [],
      chargeFee:[],
      dealFee:[],
      withdrawFee:[],
      hbType:[]
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
        isLogin=true
        that.globalData.sessionInfo = wx.getStorageSync('3rd_session') || []
        wx.getUserInfo({
          success: function (user) {
            that.globalData = user.userInfo
          }
        })
        cb&&typeof cb.success == "function" && cb.success()
      },
      fail: function () {
        //登录态过期
        //重新登录
        // 登录
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            if (res.code) {
              //发起网络请求
              wx.request({
                url: 'https://test.com/onLogin',
                data: {
                  code: res.code
                },
                success: function (res) {
                  isLogin=true
                  that.globalData.session=res.data
                  wx.setStorageSync('3rd_session', res.data)
                  wx.getUserInfo({
                    success: function (user) {
                      that.globalData = user.userInfo
                    }
                  })
                  cb && typeof cb.success == "function" && cb.success()
                  }
                 ,
                fail:function(res){

                }
              })
            } else {
              console.log('获取用户登录态失败！' + res.errMsg)
            }
          }
        })
      }
    })
    console.log(isLogin)
    wx.request({
      url: this.globalData.url,
      success: function (res) {
        console.log(res.data),
        that.globalData.chargeFee = res.data.data.chargeFee,
        that.globalData.dealFee= res.data.data.dealFee,
        that.globalData.withdrawFee= res.data.data.withdrawFee,
        that.globalData.hbType= res.data.data.hbType,
        console.log(res.data.data.hbType.length)

      },
      fail:function(res){
        console.log(res.data)
      },

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
    //检查登录状态
    that.checkSession({success:function(){
      console.log('获取用户登录态成功！')
    }})
    //请求成功

  }

})