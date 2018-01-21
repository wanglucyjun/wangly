/**
 * 小程序配置文件,chang name
 */

var host = "http://www.chemchemchem.com"

var config = {

    // host地址
    host,

    // 初始化接口
    initUrl: `${host}/site/init`,

    // 登录地址，用于建立会话
    loginUrl: `${host}/user/do-login`,
   
    // 用code换取openId
    openIdUrl: `${host}/openid`,


    // 生成红包接口
    hongbaoCreateUrl: `${host}/hongbao/create`,

    // 上传文件接口
    uploadUrl: `${host}/file/upfile`,

};

module.exports = config
