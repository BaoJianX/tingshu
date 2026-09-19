"use strict";
const utils_request = require("../../utils/request.js");
const utils_constant = require("../../utils/constant.js");
class CateGory extends utils_request.Service {
  /**
   * @description: 获取会员收费信息列表
   * @return {*}
   */
  getVipSettingList() {
    return this.get({
      url: "/api/user/vipServiceConfig/findAll"
    });
  }
  /**
   * @description: 获取用户声音分集购买支付列表
   * @return {*}
   */
  getTrackSettingList(trackId) {
    return this.get({
      url: `/api/album/trackInfo/findUserTrackPaidList/${trackId}`
    });
  }
  /**
   * @description: 获取账户可用余额
   * @return {*}
   */
  getAccountBalance() {
    return this.get({
      url: "/api/account/userAccount/getAvailableAmount"
    });
  }
  /**
   * @description: 获请求订单信息
   * @return {*}
   */
  getSubmitOrderInfo(params) {
    return this.post({
      url: "/api/order/orderInfo/trade",
      data: params
    });
  }
  /**
   * @description: 提交订单
   * @param {OrderInterface} params
   */
  submitOrder(params) {
    return this.post({
      url: "/api/order/orderInfo/submitOrder",
      data: params
    });
  }
  /**
   * @description: 微信下单接口
   * @param orderNo 订单号
   * @param paymentType 微信下单类型 支付类型：1301-订单 1302-充值
   */
  wechatPay(orderNo, paymentType = utils_constant.WX_ORDER_TYPE_MAP.Order) {
    return this.post({
      url: `/api/payment/wxPay/createJsapi/${paymentType}/${orderNo}`
    });
  }
  /**
   * @description: 查询订单支付状态
   * @param orderNo 订单号
   */
  queryOrderPayStatus(orderNo) {
    return this.get({
      url: `/api/payment/wxPay/queryPayStatus/${orderNo}`,
      loading: false
    });
  }
  /**
   * @description: 充值接口
   * @param amount 充值金额
   * @param payWay 支付方式
   */
  investAmount(amount, payWay = utils_constant.PAY_WAY_MAP.WeChat) {
    return this.post({
      url: "/api/account/rechargeInfo/submitRecharge",
      data: { amount, payWay }
    });
  }
  /**
   * @description: 消费记录
   * @return {*}
   * @param params
   */
  getConsumeRecordList(params) {
    return this.get({
      url: `/api/account/userAccount/findUserConsumePage/${params.page}/${params.limit}`
    });
  }
  /**
   * @description: 充值记录
   * @return {*}
   * @param params
   */
  getInvestRecordList(params) {
    return this.get({
      url: `/api/account/userAccount/findUserRechargePage/${params.page}/${params.limit}`
    });
  }
  /**
   * @description: 查询订单列表
   * @param
   */
  queryOrdeList(params) {
    return this.get({
      url: `/api/order/orderInfo/findUserPage/${params.page}/${params.limit}`,
      loading: true
    });
  }
  /**
   * @description: 查询订单列表
   * @param
   */
  queryOrderInfo(orderNo) {
    return this.get({
      url: `/api/order/orderInfo/getOrderInfo/${orderNo}`,
      loading: true
    });
  }
}
const order = new CateGory();
exports.order = order;
