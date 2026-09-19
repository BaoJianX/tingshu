"use strict";
const common_vendor = require("../common/vendor.js");
const GraceRequestConfig = {
  apiBaseUrl: "http://139.198.30.131:8500/api",
  debug: true,
  expiredTime: 3600,
  postHeaderDefault: "application/json",
  getToken: function() {
    return new Promise((resolve, reject) => {
      resolve();
    });
  },
  writeLoginToken: function(token, uid) {
    var loginToken = token + "-" + uid;
    common_vendor.index.setStorageSync(this.userTokenKeyName, loginToken);
    return;
  },
  tokenErrorMessage: function() {
    common_vendor.index.showToast({
      title: "请求失败, 请重试",
      icon: "none"
    });
  }
};
exports.GraceRequestConfig = GraceRequestConfig;
