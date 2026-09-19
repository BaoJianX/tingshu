"use strict";
const common_vendor = require("../common/vendor.js");
const stores_user = require("../stores/user.js");
const utils_utils = require("./utils.js");
const config_confjg = require("../config/confjg.js");
const BASEURL = config_confjg.BASE_URL;
class Service {
  api(opts) {
    if (!opts.method)
      opts.method = "GET";
    opts.loading = opts.loading !== false;
    const token = stores_user.useUserStore().token;
    const header = {
      token,
      "Content-type": "application/json; charset=UTF-8"
    };
    return new Promise((resolve, reject) => {
      if (opts.loading)
        common_vendor.index.showLoading({
          title: "加载中",
          mask: true
        });
      common_vendor.index.request({
        url: BASEURL + opts.url,
        data: opts.data,
        method: opts.method,
        header,
        success: (res) => {
          common_vendor.index.hideLoading();
          if (res.statusCode === 200) {
            if (res.data.code == 200) {
              resolve(res.data);
            } else if (res.data.code == 208) {
              common_vendor.index.showModal({
                title: "提示",
                content: "登录过期，请重新登录",
                success: function(res2) {
                  if (res2.confirm) {
                    common_vendor.index.clearStorageSync();
                    common_vendor.index.redirectTo({
                      url: `/pages/login/login`
                    });
                    utils_utils.setRedirectUrl();
                  } else if (res2.cancel) {
                    console.log("用户不想登陆");
                  }
                }
              });
              resolve(res.data);
            } else {
              common_vendor.index.showToast({
                title: res.data.message,
                icon: "error",
                duration: 1500
              });
              reject(res.data);
            }
          }
        },
        fail: () => {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "net error!",
            icon: "none",
            duration: 2e3
          });
        }
      });
    });
  }
  get(options) {
    options.method = "GET";
    return this.api(options);
  }
  post(options) {
    options.method = "POST";
    return this.api(options);
  }
  put(options) {
    options.method = "PUT";
    return this.api(options);
  }
  delete(options) {
    options.method = "DELETE";
    return this.api(options);
  }
}
exports.Service = Service;
