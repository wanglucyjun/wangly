const config = require('../config')
var utils = require('./util');
/***
 * @class
 * 表示登录过程中发生的异常
 */
var LoginError = (function () {
  function LoginError(message) {
    Error.call(this, message);
    this.message = message;
  }

  LoginError.prototype = new Error();
  LoginError.prototype.constructor = LoginError;

  return LoginError;
})();
/**
 * 微信登录，获取 code 和 encryptData
 */
var getWxLoginResult = function getLoginCode(callback) {
  console.log('getWxLoginResult');
  wx.login({
    success: function (loginResult) {
      console.log(loginResult);
      callback(null, { code: loginResult.code});
    },

    fail: function (loginError) {
      var error = new LoginError('微信登录失败，请检查网络状态');
      error.detail = loginError;
      callback(error, null);
    },
  });
};
var noop = function noop() { };
var defaultOptions = {
  method: 'GET',
  success: noop,
  fail: noop
};


/**
 * @method
 * 进行服务器登录，以获得登录会话
 *
 * @param {Object} options 登录配置
 * @param {string} options.loginUrl 登录使用的 URL，服务器应该在这个 URL 上处理登录请求
 * @param {string} [options.method] 请求使用的 HTTP 方法，默认为 "POST"
 * @param {Function} options.success(uinfo) 登录成功后的回调函数，参数 userInfo 微信用户信息
 * @param {Function} options.fail(error) 登录失败后的回调函数，参数 error 错误信息
 */
var login = function login(options) {
  console.log('login')
  options = utils.extend({}, defaultOptions, options);

  var doLogin = () => getWxLoginResult(function (wxLoginError, wxLoginResult) {
    if (wxLoginError) {
      options.fail(wxLoginError);
      return;
    }
    console.log(wxLoginResult);
    var code = wxLoginResult.code;
    wx.request({
      url: config.loginUrl,
      method: options.method,
      data: {
        code: code,
      },
      success: function (result){
        console.log(result);
        var data = result.data;
        // 成功地响应会话信息
        if (data) {
          if (data.code == '0') {
            //获取用户信息
            wx.getUserInfo({
              success: function (userResult) {
                var userInfo = userResult.userInfo;
                var signature = userResult.signature;
                var rawData = userResult.rawData;
                if (data.data.needInfo == 1) {
                  userInfo.token = data.data.sessionInfo
                  wx.request({
                    url: config.updateUrl,
                    data: userInfo,
                    success: function (res) {
                    },
                    fail: function (res) {
                      //var errorMessage = '登录失败:' + data.msg || '未知错误';
                      //保存失败
                    }
                  })
                }
                //设置session
                var session = {
                  session: data.data,//token,needinfo
                  uinfo: userInfo
                };
                Session.set(session);
                options.success(userInfo);
              },

              fail: function (userError) {
                var error = new LoginError('获取微信用户信息失败，请检查网络状态');
                error.detail = userError;
                options.fail(error);
              },
            });
          }else{
            var errorMessage = '登录失败:' + data.msg || '未知错误';
            var noSessionError = new LoginError(errorMessage);
            options.fail(noSessionError);
          }
        }else{
          var errorMessage = '登录请求没有包含会话响应，请确保服务器处理 `' + config.loginUrl + '` 的时候输出登录结果';
          var noSessionError = new LoginError(errorMessage);
          options.fail(noSessionError);
        }
      },
      fail: function (loginResponseError){
        var error = new LoginError('登录失败，可能是网络错误或者服务器发生异常');
        options.fail(error);
      }
    });
  });
  doLogin();
};
var SESSION_KEY = 'weapp_session_' + 'wx2fa05e7b28426662';    //WX_SESSION_MAGIC_ID

var Session = {
  get: function () {
    return wx.getStorageSync(SESSION_KEY) || null;
  },

  set: function (session) {
    wx.setStorageSync(SESSION_KEY, session);
  },

  clear: function () {
    wx.removeStorageSync(SESSION_KEY);
  },
};
var checkSession = function (options){
  console.log('checkSession')
  options = utils.extend({}, defaultOptions, options);
  var session = Session.get();
  if (session) {
        wx.checkSession({
            success: function () {
                options.success(session);
            },

            fail: function () {
                Session.clear();
                login(options);
            },
        });
  } else {
    login(options);
  }
};
module.exports = {
  LoginError: LoginError,
  login: login,
  checkSession: checkSession,
  getSession: Session.get,
};
