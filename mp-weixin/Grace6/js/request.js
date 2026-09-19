"use strict";
const common_vendor = require("../../common/vendor.js");
const custom_graceRequestConfig = require("../../custom/graceRequestConfig.js");
const Grace6_js_md5 = require("./md5.js");
const GraceRequest = {
  // token 数据记录
  token: "",
  // 
  getTokenFromApi: function(count) {
    return new Promise((resolve, reject) => {
      this.debug("第 " + count + " 次 token 请求");
      let p = custom_graceRequestConfig.GraceRequestConfig.getToken();
      p.then((res) => {
        this.token = res;
        resolve(res);
      }).catch((err) => {
        reject("token error");
      });
    });
  },
  // 获取 token
  getToken: function(count) {
    return new Promise((resolve, reject) => {
      var token = common_vendor.index.getStorageSync(custom_graceRequestConfig.GraceRequestConfig.localTokenKeyName);
      if (!token || token == "") {
        let p = this.getTokenFromApi(1);
        p.then((res) => {
          this.token = res;
          resolve(res);
        }).catch((err) => {
          let p2 = this.getTokenFromApi(2);
          p2.then((res) => {
            this.token = res;
            resolve(res);
          }).catch((err2) => {
            reject(err2);
          });
        });
      } else {
        var expiredTime = custom_graceRequestConfig.GraceRequestConfig.expiredTime;
        expiredTime *= 1e3;
        var tokenTime = Number(common_vendor.index.getStorageSync("GraceRequestTokenTime"));
        tokenTime += expiredTime;
        var dateObj = new Date();
        var cTime = dateObj.getTime();
        if (tokenTime > cTime) {
          this.token = token;
          resolve(token);
        } else {
          let p = this.getTokenFromApi(1);
          p.then((res) => {
            this.token = res;
            resolve(res);
          }).catch((err) => {
            let p2 = this.getTokenFromApi(2);
            p2.then((res) => {
              this.token = res;
              resolve(res);
            }).catch((err2) => {
              reject(err2);
            });
          });
        }
      }
    });
  },
  // 设置默认值补齐
  requestInit: function(sets, withLoginToken, url) {
    if (!sets.data) {
      sets.data = {};
    }
    if (!sets.header) {
      sets.header = {};
    }
    if (!sets.timeout) {
      sets.timeout = custom_graceRequestConfig.GraceRequestConfig.expiredTime;
    }
    if (!sets.dataType) {
      sets.dataType = "json";
    }
    if (this.token)
      sets.header.token = this.token;
    if (withLoginToken) {
      var loginToken = this.checkLogin();
      if (loginToken) {
        sets.header.logintoken = loginToken;
      }
    }
    {
      sets.requestUrl = custom_graceRequestConfig.GraceRequestConfig.apiBaseUrl + url;
    }
    return sets;
  },
  // 服务端 token 错误处理
  tokenErrorHandle: function(res) {
    if (res.data && res.data == "token error") {
      common_vendor.index.removeStorageSync(custom_graceRequestConfig.GraceRequestConfig.localTokenKeyName);
      return true;
    }
    return false;
  },
  // 请求基础函数
  base: function(url, sets, withLoginToken, type, isSign) {
    return new Promise(async (resolve, reject) => {
      let p = this.getToken();
      p.then((token) => {
        if (this.befor != null) {
          this.befor();
          this.befor = null;
        }
        sets = this.requestInit(sets, withLoginToken, url);
        if (type == "POST") {
          if (!sets.header["content-type"]) {
            sets.header["content-type"] = custom_graceRequestConfig.GraceRequestConfig.postHeaderDefault;
          }
        }
        if (!isSign) {
          isSign = false;
        }
        if (isSign) {
          sets.data = this.sign(sets.data);
        }
        common_vendor.index.request({
          url: sets.requestUrl,
          data: sets.data,
          timeout: sets.timeout,
          dataType: sets.dataType,
          header: sets.header,
          method: type
        }).then((data) => {
          if (this.after != null) {
            this.after();
            this.after = null;
          }
          resolve(data.data);
        }).catch((err) => {
          if (this.after != null) {
            this.after();
            this.after = null;
          }
          reject(err);
        });
      }).catch((err) => {
        if (this.after != null) {
          this.after();
          this.after = null;
        }
        reject(err);
      });
    });
  },
  // GET 请求
  get: function(url, sets, withLoginToken) {
    return new Promise((resolve, reject) => {
      if (!sets) {
        sets = {};
      }
      if (!withLoginToken) {
        withLoginToken = false;
      }
      let p = this.base(url, sets, withLoginToken, "GET");
      p.then((res) => {
        if (this.tokenErrorHandle(res)) {
          let p2 = this.base(url, sets, withLoginToken, "GET");
          p2.then((res2) => {
            resolve(res2);
          }).catch((err) => {
            reject(err);
          });
        } else {
          resolve(res);
        }
      }).catch((err) => {
        reject(err);
      });
    });
  },
  // POST 请求
  post: function(url, sets, isSign, withLoginToken) {
    return new Promise((resolve, reject) => {
      if (!sets) {
        sets = {};
      }
      if (!isSign) {
        isSign = false;
      }
      if (!withLoginToken) {
        withLoginToken = false;
      }
      let p = this.base(url, sets, withLoginToken, "POST", isSign);
      p.then((res) => {
        if (this.tokenErrorHandle(res)) {
          let p2 = this.base(url, sets, withLoginToken, "POST", isSign);
          p2.then((res2) => {
            resolve(res2);
          }).catch((err) => {
            reject(err);
          });
        } else {
          resolve(res);
        }
      }).catch((err) => {
        reject(err);
      });
    });
  },
  // upload
  upload: function(url, filePath, fileType, sets, withLoginToken) {
    return new Promise(async (resolve, reject) => {
      let p = this.getToken();
      p.then((token) => {
        if (this.befor != null) {
          this.befor();
          this.befor = null;
        }
        sets = this.requestInit(sets, withLoginToken, url);
        if (!sets.name) {
          sets.name = "file";
        }
        common_vendor.index.uploadFile({
          url: sets.requestUrl,
          filePath,
          name: sets.name,
          formData: sets.data,
          header: sets.header
        }).then((data) => {
          if (this.after != null) {
            this.after();
            this.after = null;
          }
          resolve(data.data);
        }).catch((err) => {
          if (this.after != null) {
            this.after();
            this.after = null;
          }
          reject(err);
        });
      }).catch((err) => {
        if (this.after != null) {
          this.after();
          this.after = null;
        }
        reject(err);
      });
    });
  },
  // debug 函数
  debug: function(content) {
    console.log(content);
  },
  // 签名算法
  sign: function(data) {
    if (data.gracesign) {
      delete data.gracesign;
    }
    var vals = [];
    Object.keys(data).sort().map((key) => {
      vals.push(data[key]);
    });
    vals.push(this.token);
    var sign = Grace6_js_md5.md5.md5(vals.join("-"));
    data.gracesign = sign;
    return data;
  },
  // 登录检查
  // 登录后在本地保存一个 token
  checkLogin: function(notLoginDo) {
    var loginToken = common_vendor.index.getStorageSync(custom_graceRequestConfig.GraceRequestConfig.userTokenKeyName);
    if (!loginToken || loginToken == "") {
      loginToken = "";
      if (notLoginDo) {
        common_vendor.index.showToast({ title: "请登录", icon: "none", mask: true });
        setTimeout(() => {
          notLoginDo();
        }, 1500);
      }
      return false;
    }
    return loginToken;
  },
  // 跳转到登录页面
  gotoLogin: function(path, opentype) {
    if (!path) {
      path = "../login/login";
    }
    if (!opentype) {
      opentype = "redirect";
    }
    switch (opentype) {
      case "redirect":
        common_vendor.index.redirectTo({ url: path });
        break;
      case "navigate":
        common_vendor.index.navigateTo({ url: path });
        break;
      case "switchTab":
        common_vendor.index.switchTab({ url: path });
        break;
    }
  }
};
exports.GraceRequest = GraceRequest;
