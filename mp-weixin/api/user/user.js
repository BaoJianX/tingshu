"use strict";
const utils_request = require("../../utils/request.js");
class CateGory extends utils_request.Service {
  /**
   * @description 小程序登录
   * @param  {string} code
   */
  getLogin(code) {
    return this.get({
      url: `/api/user/wxLogin/wxLogin/${code}`
    });
  }
  /**
   * @description 获取用户登陆信息
   */
  getUserInfo() {
    return this.get({
      url: `/api/user/wxLogin/getUserInfo`
    });
  }
  /**
   * @description 更新用户信息
   */
  updateUserInfo(userInfo) {
    return this.post({
      url: `/api/user/wxLogin/updateUser`,
      data: userInfo
    });
  }
}
const user = new CateGory();
exports.user = user;
