const uploadUrl = require('../config').uploadUrl
const hongbaoCreateUrl = require('../config').hongbaoCreateUrl
const app = getApp()

//获取返回红包类型的模版
function getModel() {
  var that = this
  var temdata = app.globalData.hbType[0]
  that.setData({
    chargeParam: temdata.chargeParam,
    dealParam: temdata.dealParam,
    withdrawParam: temdata.withdrawParam,
    sn: temdata.sn,
  })
  console.log("sn is " + this.data.sn);

}

//费用相关
function getChargeFee() {
  var that = this
  //that.getModel();
  var tempparam = app.globalData.chargeFee[app.globalData.hbType[0].chargeParam]

  if (tempparam.isFee == "0") {
    var fuwufee="0.0"
    return fuwufee
  }
  else {
    var rate=tempparam.rate
    console.log("rate is " + rate);
    console.log("rate is " + that.data.Money * tempparam.rate);
    return that.data.Money * rate;
  }
}
//上传文件方法
function uploadFile(filePath) {
  var that = this
  wx.uploadFile({
    url: uploadUrl,
    filePath: filePath,
    name: 'recordfile',
    formData: {
      'token': 'adb'
    },
    success: function (res) {
      var data = res.data
      data = JSON.parse(data);

      console.log(data)

    }
  })

}
//下载服务器上的文件
function downloadFile(){
  var that = this
  var url = that.data.NetUrl
  console.log("download url is " + url)
  wx.downloadFile({
    url: url, //仅为示例，并非真实的资源
    success: function (res) {
      console.log("download return " + res.statusCode)
      console.log("download return " + res.tempFilePath)
      if (res.statusCode === 200) {
        console.log("download return " + res.tempFilePath)
      }
      wx.playVoice({
        filePath: res.tempFilePath,
      })
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
function hongbaoCreate(Money,count,fuwufee){
  var that = this
wx.request({

  url: hongbaoCreateUrl,
  data: {
    token:"1-2-3",
    //kouling: this.data.kouling,
    money: Money,
    count: count,
    fuwufee:fuwufee,
    type: 1,
    isbalance: 0
  },

success:function(res){
console.log(res.data)
}
})
  }


 module.exports={
  getModel:getModel,
  getChargeFee: getChargeFee,
  uploadFile:uploadFile,
  downloadFile: downloadFile,
  hongbaoCreate: hongbaoCreate

}

