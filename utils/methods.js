const uploadUrl = require('../config').uploadUrl
const hongbaoCreateUrl = require('../config').hongbaoCreateUrl
const app = getApp()
var innerAudioContext = wx.createInnerAudioContext()

//获取返回红包类型的模版
function getModel(type) {
  var that = this
  var temdata = app.globalData.hbType[type]
   return temdata
 
}
//费用相关
function getChargeFee(type) {
  var that = this
  var tempparam = app.globalData.chargeFee[getModel(type).chargeParam]

  if (tempparam.isFee == "0") {
    var fuwufee="0.0"
    return fuwufee
  }
  else {
    var rate=tempparam.rate
    var fuwufee=that.data.Money * rate
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
//播放网络地址音频
function playNetVoice(NetUrl){
  innerAudioContext.src = 'http://www.chemchemchem.com/file/201801212303/40affe2a9c37c223dfcca82339b8aee2.silk';
  console.log("net url is "+innerAudioContext.src)
  innerAudioContext.play();
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

success:function(res){
  wx.navigateTo({
    url: '/pages/index/Share/Share?id='+res.data.data.hotid,
  })
}
})
  }


 module.exports={
  getModel:getModel,
  getChargeFee: getChargeFee,
  uploadFile:uploadFile,
  downloadFile: downloadFile,
  hongbaoCreate: hongbaoCreate,
  playNetVoice:playNetVoice
}

