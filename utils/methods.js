const uploadUrl = require('../config').uploadUrl
const hongbaoCreateUrl = require('../config').hongbaoCreateUrl
const userinfoUrl = require('../config').userinfoUrl
const app = getApp()
var innerAudioContext = wx.createInnerAudioContext()

//获取返回红包类型的模版
function getModel(type) {
  var that = this
  var temdata = app.globalData.hbType[type]
   return temdata
 
}
//费用相关,得到生成红包时返回的服务费
function getSendFee(type,money) {
  var that = this
  var tempparam = app.globalData.sendFee[getModel(type).sendParam]

  if (tempparam.isFee == "0") {
    var fuwufee=0.0
    return fuwufee
  }
  else {
    var rate=tempparam.rate
    var fuwufee=money * rate
    console.log("rate is " + rate);
    console.log("fuwufee is " + fuwufee);
    if(fuwufee < tempparam.minVal){
      fuwufee=tempparam.minVal
    }
    return fuwufee;
  }
}
//费用相关,得到充值是需要的服务费
function getChargeFee(type,money) {
  var that = this
  var tempparam = app.globalData.chargeFee[getModel(type).chargeParam]

  if (tempparam.isFee == "0") {
    var fuwufee = 0.0
    return fuwufee
  }
  else {
    var rate = tempparam.rate
    var fuwufee = money * rate
    console.log("rate is " + rate);
    console.log("fuwufee is " + fuwufee);
    return fuwufee;
  }
}
//费用相关,领取红包需要的服务费
function getReceiveFee(type) {
  var that = this
  var tempparam = app.globalData.receiveFee[getModel(type).receiveParam]

  if (tempparam.isFee == "0") {
    var fuwufee = 0.0
    return fuwufee
  }
  else {
    var rate = tempparam.rate
    var fuwufee = that.data.Money * rate
    console.log("rate is " + rate);
    console.log("fuwufee is " + fuwufee);
    return fuwufee;
  }
}

//费用相关,体现需要的服务费
function getWithdrawFee(type) {
  var that = this
  var tempparam = app.globalData.withdrawFee[getModel(type).withdrawParam]

  if (tempparam.isFee == "0") {
    var fuwufee = "0.0"
    return fuwufee
  }
  else {
    var rate = tempparam.rate
    var fuwufee = that.data.Money * rate
    console.log("rate is " + rate);
    console.log("fuwufee is " + fuwufee);
    return fuwufee;
  }
}

// 返回是否使用余额支付，初始化接口返回,0为不使用余额支付，1为使用余额支付
function get_Use_Balance(type){
    var isBalance=getModel(type).use_balance;
    return isBalance
}
//得到用户基本账号余额信息
function getAccountInfo(){
  wx.request({
    url: userinfoUrl,
    data:{
    'token': app.globalData.sessionInfo,
  },
  success:function(res){
    console.log(res.data.data);
    var accountMoney=res.data.data.money;
  }
  })
}
//上传文件方法
function uploadFile(obj) {
  var that = this
  var serverFilePath;
  wx.uploadFile({
    url: uploadUrl,
    filePath: obj.filePath,
    name: 'recordfile',
    formData: {
      'token': app.globalData.sessionInfo
    },
    success: function (res) {
      var data = res.data
      data = JSON.parse(data);
      serverFilePath=data.data
      //console.log("upload return is " + serverFilePath)
      wx.setStorageSync({
        key: "voiceTempFile",
        data: serverFilePath
      })
      obj.success(serverFilePath)
      console.log("upload return is " + serverFilePath)
    }
  })
}
//下载服务器上的文件
function downloadFile(netUrl){
  var that = this
  //var url = that.data.NetUrl
  console.log("download url is " + netUrl)
  wx.downloadFile({
    url: netUrl, 
    success: function (res) {
      console.log("download return " + res.statusCode)
      console.log("download return " + res.tempFilePath)
      if (res.statusCode === 200) {
        console.log("download return " + res.tempFilePath)
        return res.tempFilePath
      }
     
      // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容

    }
  })
}

//保存文件到本地
function saveFileToLocal() {
  var that = this
  wx.saveFile({
    tempFilePath: that.data.tempFilePath,
    success: function (res) {
      var filePath = res.savedFilePath
      that.setData({
        filePath: filePath
      })
      console.log(filePath)
    }
  })
  wx.getSavedFileList({
    success: function (res) {
      console.log(res.fileList)
    }
  })

}

//创建红包接口请求
function hongbaoCreate(type,question,power,Money,num,fee,filePath){
  var that = this
wx.request({

  url: hongbaoCreateUrl,
  data: {
    token: app.globalData.sessionInfo,
    type:type,
    question:question,
    power:power,
    money: Money,
    num: num,
    fee:fee,
    filePath:filePath,
    usebalance:get_Use_Balance(type),
  },

success:function(res) {
    console.log(res.data)
    if (res.data.code == '101') {
        wx.showToast({
            title: res.data.message,
        })
    }
    if (res.data.code == '0') {
        var hotid = res.data.data.hotid;
        var orderid=res.data.data.orderid;
        if (res.data.data.needpay == '0'){
          //不需要调取支付，直接跳转
          wx.navigateTo({
            url: '/pages/index/Share/Share?id=' + res.data.data.hotid,
          })
        }
        else{
          //调起微信支付


        }
       
    }
}
})
  }


 module.exports={
  getModel:getModel,
  getChargeFee: getChargeFee,
  getSendFee: getSendFee,
  getReceiveFee: getReceiveFee,
  getWithdrawFee: getWithdrawFee,
  uploadFile:uploadFile,
  downloadFile: downloadFile,
  hongbaoCreate: hongbaoCreate,
  getAccountInfo: getAccountInfo,
}

