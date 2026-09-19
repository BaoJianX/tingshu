"use strict";
const common_vendor = require("../common/vendor.js");
require("./user.js");
const utils_constant = require("../utils/constant.js");
const api_order_order = require("../api/order/order.js");
const hooks_useUpdateUserInfo = require("../hooks/useUpdateUserInfo.js");
const useOrderStore = common_vendor.defineStore("order", {
  state: () => {
    return {
      // 确认订单所需信息
      confirmOrderInfo: {},
      // 提交订单所需信息
      submitOrderInfo: {},
      // 订单号
      orderNo: ""
    };
  },
  actions: {
    // 设置订单所需信息
    setConfirmOrderInfo(params) {
      this.confirmOrderInfo = params;
      this.getSubmitOrderInfo();
    },
    // 设置提交订单所需信息
    setSubmitOrderInfo(params) {
      this.submitOrderInfo = params;
    },
    // 设置订单号
    setOrderNo(orderNo) {
      this.orderNo = orderNo;
    },
    // 提交订单所需信息
    async getSubmitOrderInfo() {
      try {
        const res = await api_order_order.order.getSubmitOrderInfo(this.confirmOrderInfo);
        if (res.data.itemType === utils_constant.PAYMENT_ITEM_TYPE_MAP.Track) {
          res.data.payWay = utils_constant.PAY_WAY_MAP.Balance;
        }
        this.setSubmitOrderInfo(res.data);
      } catch (error) {
        console.log(error);
      }
    },
    // 设置订单支付方式
    setOrderPayWay(payWay) {
      this.submitOrderInfo.payWay = payWay;
    },
    // 提交订单
    async submitOrder() {
      try {
        const res = await api_order_order.order.submitOrder(this.submitOrderInfo);
        this.orderNo = res.data.orderNo;
        if (this.submitOrderInfo.payWay === utils_constant.PAY_WAY_MAP.Balance) {
          this.paySuccess();
        } else if (this.submitOrderInfo.payWay === utils_constant.PAY_WAY_MAP.WeChat) {
          await this.wechatPay(res.data.orderNo);
          await this.queryOrderPayStatus(res.data.orderNo);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 纯订单号提交订单
    async submitOrderForOrderNumber(orderNo) {
      try {
        if (this.submitOrderInfo.payWay === utils_constant.PAY_WAY_MAP.WeChat) {
          await this.wechatPay(orderNo || this.orderNo);
          await this.queryOrderPayStatus(orderNo || this.orderNo);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 微信支付逻辑
    async wechatPay(orderNo, paymentType = utils_constant.WX_ORDER_TYPE_MAP.Order) {
      try {
        console.log("调用后端微信下单接口---start");
        const res = await api_order_order.order.wechatPay(orderNo, paymentType);
        console.log("调用后端微信下单接口---end");
        this.wechatOfficialPay(res.data);
      } catch (error) {
        console.log(error);
      }
    },
    // 微信官方支付接口
    async wechatOfficialPay(params) {
      try {
        console.log("微信官方支付接口---start");
        const res = await common_vendor.wx$1.requestPayment(Object.assign({
          timeStamp: "",
          nonceStr: "",
          package: "",
          signType: "MD5",
          paySign: ""
        }, params));
        console.log("微信官方支付接口---end");
        console.log("支付成功");
      } catch (err) {
        console.log("err", err);
      }
    },
    // 查询订单支付状态
    async queryOrderPayStatus(orderNo, times = 10, interval = 2e3, callback = () => this.paySuccess()) {
      try {
        console.log("轮询查询订单支付状态---start");
        const res = await api_order_order.order.queryOrderPayStatus(orderNo);
        if (res.data) {
          callback();
        } else {
          if (times > 1) {
            console.log("查询支付信息失败，继续查询-----------", times);
            setTimeout(() => {
              this.queryOrderPayStatus(orderNo, times - 1, interval);
            }, interval);
          } else {
            common_vendor.index.showToast({
              title: "查询支付信息失败",
              icon: "error",
              duration: 2e3
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 充值金额
    async investAmount(amount) {
      try {
        const res = await api_order_order.order.investAmount(amount);
        await this.wechatPay(res.data.orderNo, utils_constant.WX_ORDER_TYPE_MAP.Recharge);
        await this.queryOrderPayStatus(res.data.orderNo, 10, 2e3, () => this.investSuccess());
      } catch (error) {
        console.log(error);
      }
    },
    // 支付成功
    paySuccess() {
      setTimeout(() => {
        common_vendor.index.showToast({
          title: "支付成功",
          icon: "success",
          duration: 2e3
        });
      }, 200);
      console.log("去往支付成功页面");
      common_vendor.index.redirectTo({
        url: `/pages/paySuccess/paySuccess?orderNo=${this.orderNo}`
      });
      this.clearOrderInfo();
      this.updateUserInfo();
    },
    // 充值成功
    investSuccess() {
      this.clearOrderInfo();
      this.updateUserInfo();
      setTimeout(() => {
        common_vendor.index.showToast({
          title: "充值成功",
          icon: "success",
          duration: 2e3
        });
      }, 200);
      console.log("充值成功");
    },
    // 清空相关订单信息
    clearOrderInfo() {
      this.confirmOrderInfo = {};
      this.submitOrderInfo = {};
      this.orderNo = "";
    },
    //   更新用户信息
    updateUserInfo() {
      const { updateUserInfo } = hooks_useUpdateUserInfo.useUpdateUserInfo();
      setTimeout(() => {
        updateUserInfo();
      }, 1500);
    }
  }
});
exports.useOrderStore = useOrderStore;
