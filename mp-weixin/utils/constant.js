"use strict";
const config_confjg = require("../config/confjg.js");
const TOKEN_KEY = "token";
const USER_KEY = "user";
const REDIRECT_URL_KEY = "redirectUrl";
const PAY_TYPE = [
  { name: "免费", value: "0101" },
  { name: "VIP免费", value: "0102" },
  { name: "付费", value: "0103" }
];
var PAY_TYPE_MAP = /* @__PURE__ */ ((PAY_TYPE_MAP2) => {
  PAY_TYPE_MAP2["Free"] = "0101";
  PAY_TYPE_MAP2["VipFree"] = "0102";
  PAY_TYPE_MAP2["NotFree"] = "0103";
  return PAY_TYPE_MAP2;
})(PAY_TYPE_MAP || {});
var PAYMENT_ITEM_TYPE_MAP = /* @__PURE__ */ ((PAYMENT_ITEM_TYPE_MAP2) => {
  PAYMENT_ITEM_TYPE_MAP2["Album"] = "1001";
  PAYMENT_ITEM_TYPE_MAP2["Track"] = "1002";
  PAYMENT_ITEM_TYPE_MAP2["Vip"] = "1003";
  return PAYMENT_ITEM_TYPE_MAP2;
})(PAYMENT_ITEM_TYPE_MAP || {});
var PAY_WAY_MAP = /* @__PURE__ */ ((PAY_WAY_MAP2) => {
  PAY_WAY_MAP2["WeChat"] = "1101";
  PAY_WAY_MAP2["Alipay"] = "1102";
  PAY_WAY_MAP2["Balance"] = "1103";
  return PAY_WAY_MAP2;
})(PAY_WAY_MAP || {});
var PRICE_TYPE_MAP = /* @__PURE__ */ ((PRICE_TYPE_MAP2) => {
  PRICE_TYPE_MAP2["Single"] = "0201";
  PRICE_TYPE_MAP2["Album"] = "0202";
  return PRICE_TYPE_MAP2;
})(PRICE_TYPE_MAP || {});
var WX_ORDER_TYPE_MAP = /* @__PURE__ */ ((WX_ORDER_TYPE_MAP2) => {
  WX_ORDER_TYPE_MAP2["Order"] = "1301";
  WX_ORDER_TYPE_MAP2["Recharge"] = "1302";
  return WX_ORDER_TYPE_MAP2;
})(WX_ORDER_TYPE_MAP || {});
var ORDER_STATUS_MAP = /* @__PURE__ */ ((ORDER_STATUS_MAP2) => {
  ORDER_STATUS_MAP2["Unpaid"] = "0901";
  ORDER_STATUS_MAP2["Paid"] = "0902";
  ORDER_STATUS_MAP2["Cancelled"] = "0903";
  return ORDER_STATUS_MAP2;
})(ORDER_STATUS_MAP || {});
const UPLOAD_URL = {
  IMAGE: `${config_confjg.BASE_UPLOAD_URL}/api/album/fileUpload`,
  TRACK: `${config_confjg.BASE_UPLOAD_URL}/api/album/trackInfo/uploadTrack`
};
var ChatMessageType = /* @__PURE__ */ ((ChatMessageType2) => {
  ChatMessageType2["HEART_BEAT"] = "0";
  ChatMessageType2["PUBLIC_MSG"] = "1";
  ChatMessageType2["JOIN_CHAT"] = "2";
  ChatMessageType2["CLOSE_SOCKET"] = "3";
  ChatMessageType2["ONLINE_NUM"] = "4";
  ChatMessageType2["TOKEN_INVALID"] = "-1";
  return ChatMessageType2;
})(ChatMessageType || {});
exports.ChatMessageType = ChatMessageType;
exports.ORDER_STATUS_MAP = ORDER_STATUS_MAP;
exports.PAYMENT_ITEM_TYPE_MAP = PAYMENT_ITEM_TYPE_MAP;
exports.PAY_TYPE = PAY_TYPE;
exports.PAY_TYPE_MAP = PAY_TYPE_MAP;
exports.PAY_WAY_MAP = PAY_WAY_MAP;
exports.PRICE_TYPE_MAP = PRICE_TYPE_MAP;
exports.REDIRECT_URL_KEY = REDIRECT_URL_KEY;
exports.TOKEN_KEY = TOKEN_KEY;
exports.UPLOAD_URL = UPLOAD_URL;
exports.USER_KEY = USER_KEY;
exports.WX_ORDER_TYPE_MAP = WX_ORDER_TYPE_MAP;
