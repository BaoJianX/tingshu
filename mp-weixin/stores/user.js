"use strict";
const common_vendor = require("../common/vendor.js");
const utils_constant = require("../utils/constant.js");
const utils_utils = require("../utils/utils.js");
const api_user_user = require("../api/user/user.js");
const api_order_order = require("../api/order/order.js");
const useUserStore = common_vendor.defineStore("user", {
  state: () => {
    return {
      user: JSON.parse(common_vendor.index.getStorageSync(utils_constant.USER_KEY) || "{}"),
      token: common_vendor.index.getStorageSync(utils_constant.TOKEN_KEY),
      amount: 0
    };
  },
  actions: {
    // 微信登陆
    loginWithWechat() {
      common_vendor.index.login({
        provider: "weixin",
        success: async (loginRes) => {
          await this.getToken(loginRes.code);
          await this.getUserInfo();
          const redirectUrl = utils_utils.getRedirectUrl();
          console.log("redirectUrl", redirectUrl);
          common_vendor.index.redirectTo({
            url: redirectUrl ? redirectUrl : "/pages/index/index"
          });
          utils_utils.clearRedirectUrl();
          await this.getAccountBalance();
        },
        fail: (err) => {
          console.log(err);
        }
      });
    },
    // 获取token
    async getToken(code) {
      try {
        const res = await api_user_user.user.getLogin(code);
        if (res.data.token) {
          common_vendor.index.setStorageSync(utils_constant.TOKEN_KEY, res.data.token);
          this.token = res.data.token;
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 获取用户信息
    async getUserInfo() {
      try {
        const res = await api_user_user.user.getUserInfo();
        if (!res.data.nickname || !res.data.avatarUrl) {
          common_vendor.index.getUserInfo({
            provider: "weixin",
            success: async (infoRes) => {
              console.log();
              const params = {
                avatarUrl: infoRes.userInfo.avatarUrl,
                nickname: infoRes.userInfo.nickName
              };
              await this.updateUserInfo(params);
              await this.getUserInfo();
            }
          });
        } else {
          this.user = res.data;
          common_vendor.index.setStorageSync(utils_constant.USER_KEY, JSON.stringify(res.data));
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 更新用户信息
    async updateUserInfo(userInfo) {
      try {
        const res = await api_user_user.user.updateUserInfo(userInfo);
      } catch (error) {
        console.log(error);
      }
    },
    // 获取账户可用余额
    async getAccountBalance() {
      try {
        const res = await api_order_order.order.getAccountBalance();
        this.amount = res.data;
      } catch (error) {
        console.log(error);
      }
    },
    // 退出登陆
    logout() {
      common_vendor.index.removeStorageSync(utils_constant.TOKEN_KEY);
      common_vendor.index.removeStorageSync(utils_constant.USER_KEY);
      this.user = {};
      this.token = "";
      common_vendor.index.navigateTo({
        url: "/pages/index/index"
      });
    }
  }
});
exports.useUserStore = useUserStore;
