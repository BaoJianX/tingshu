"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_user = require("../../stores/user.js");
const stores_order = require("../../stores/order.js");
const utils_constant = require("../../utils/constant.js");
require("../../utils/utils.js");
require("../../api/user/user.js");
require("../../utils/request.js");
require("../../config/confjg.js");
require("../../api/order/order.js");
require("../../hooks/useUpdateUserInfo.js");
if (!Array) {
  const _easycom_uni_card2 = common_vendor.resolveComponent("uni-card");
  const _easycom_gui_iphone_bottom2 = common_vendor.resolveComponent("gui-iphone-bottom");
  const _easycom_gui_page2 = common_vendor.resolveComponent("gui-page");
  (_easycom_uni_card2 + _easycom_gui_iphone_bottom2 + _easycom_gui_page2)();
}
const _easycom_uni_card = () => "../../uni_modules/uni-card/components/uni-card/uni-card.js";
const _easycom_gui_iphone_bottom = () => "../../Grace6/components/gui-iphone-bottom.js";
const _easycom_gui_page = () => "../../Grace6/components/gui-page.js";
if (!Math) {
  (_easycom_uni_card + _easycom_gui_iphone_bottom + _easycom_gui_page + PayTypeSelect)();
}
const PayTypeSelect = () => "../../components/PayTypeSelect/PayTypeSelect.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "confirmOrder",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    const orderStore = stores_order.useOrderStore();
    const payTypeSelectRef = common_vendor.ref();
    const handleCheckout = () => {
      if (orderStore.submitOrderInfo.payWay === utils_constant.PAY_WAY_MAP.Balance) {
        orderStore.submitOrder();
      } else {
        payTypeSelectRef.value.open();
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(common_vendor.unref(userStore).user.nickname),
        b: common_vendor.t(common_vendor.unref(userStore).amount),
        c: common_vendor.f(common_vendor.unref(orderStore).submitOrderInfo.orderDetailVoList, (item, k0, i0) => {
          return {
            a: item.itemUrl,
            b: common_vendor.t(item.itemName),
            c: common_vendor.t(item.itemPrice),
            d: item.itemId,
            e: "920dbde4-1-" + i0 + ",920dbde4-0"
          };
        }),
        d: common_vendor.p({
          margin: "5px",
          padding: "5px"
        }),
        e: common_vendor.t(common_vendor.unref(orderStore).submitOrderInfo.originalAmount),
        f: common_vendor.t(common_vendor.unref(orderStore).submitOrderInfo.orderAmount),
        g: Number(common_vendor.unref(orderStore).submitOrderInfo.derateAmount)
      }, Number(common_vendor.unref(orderStore).submitOrderInfo.derateAmount) ? {
        h: common_vendor.t(common_vendor.unref(orderStore).submitOrderInfo.derateAmount)
      } : {}, {
        i: common_vendor.o(handleCheckout),
        j: common_vendor.sr(payTypeSelectRef, "920dbde4-3", {
          "k": "payTypeSelectRef"
        }),
        k: common_vendor.p({
          alipaySetting: {
            isShow: false
          }
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/pages/confirmOrder/confirmOrder.vue"]]);
wx.createPage(MiniProgramPage);
