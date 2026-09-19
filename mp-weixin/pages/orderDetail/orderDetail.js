"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../stores/user.js");
const utils_constant = require("../../utils/constant.js");
const api_order_order = require("../../api/order/order.js");
const stores_order = require("../../stores/order.js");
require("../../utils/utils.js");
require("../../api/user/user.js");
require("../../utils/request.js");
require("../../config/confjg.js");
require("../../hooks/useUpdateUserInfo.js");
if (!Array) {
  const _easycom_gui_page2 = common_vendor.resolveComponent("gui-page");
  _easycom_gui_page2();
}
const _easycom_gui_page = () => "../../Grace6/components/gui-page.js";
if (!Math) {
  (_easycom_gui_page + PayTypeSelect)();
}
const PayTypeSelect = () => "../../components/PayTypeSelect/PayTypeSelect.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "orderDetail",
  setup(__props) {
    const payTypeSelectRef = common_vendor.ref();
    const orderInfo = common_vendor.ref();
    const orderStore = stores_order.useOrderStore();
    const handleCheckout = () => {
      payTypeSelectRef.value.open();
    };
    common_vendor.onLoad(async (options) => {
      var _a;
      const { orderNo } = options;
      const res = await api_order_order.order.queryOrderInfo(orderNo);
      orderInfo.value = res.data;
      if (((_a = orderInfo.value) == null ? void 0 : _a.orderStatus) === utils_constant.ORDER_STATUS_MAP.Unpaid) {
        orderStore.setOrderNo(orderNo);
      }
    });
    return (_ctx, _cache) => {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      return common_vendor.e({
        a: common_vendor.t((_a = orderInfo.value) == null ? void 0 : _a.orderStatusName),
        b: common_vendor.f((_b = orderInfo.value) == null ? void 0 : _b.orderDetailList, (item, k0, i0) => {
          return {
            a: item == null ? void 0 : item.itemUrl,
            b: common_vendor.t(item == null ? void 0 : item.itemName),
            c: common_vendor.t(item == null ? void 0 : item.itemPrice),
            d: item.id
          };
        }),
        c: common_vendor.t((_c = orderInfo.value) == null ? void 0 : _c.originalAmount),
        d: common_vendor.t((_d = orderInfo.value) == null ? void 0 : _d.orderAmount),
        e: common_vendor.t((_e = orderInfo.value) == null ? void 0 : _e.orderNo),
        f: common_vendor.t((_f = orderInfo.value) == null ? void 0 : _f.payWayName),
        g: ((_g = orderInfo.value) == null ? void 0 : _g.orderStatus) === common_vendor.unref(utils_constant.ORDER_STATUS_MAP).Unpaid
      }, ((_h = orderInfo.value) == null ? void 0 : _h.orderStatus) === common_vendor.unref(utils_constant.ORDER_STATUS_MAP).Unpaid ? {
        h: common_vendor.o(handleCheckout)
      } : {}, {
        i: common_vendor.sr(payTypeSelectRef, "1353b6cf-1", {
          "k": "payTypeSelectRef"
        }),
        j: common_vendor.p({
          wechatSetting: {
            isShow: true,
            payMode: 1
          },
          alipaySetting: {
            isShow: false
          },
          balanceSetting: {
            isShow: false
          }
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1353b6cf"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/pages/orderDetail/orderDetail.vue"]]);
wx.createPage(MiniProgramPage);
