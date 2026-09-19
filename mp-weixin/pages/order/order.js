"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../stores/user.js");
const api_order_order = require("../../api/order/order.js");
require("../../utils/constant.js");
require("../../config/confjg.js");
require("../../utils/utils.js");
require("../../api/user/user.js");
require("../../utils/request.js");
if (!Array) {
  const _easycom_gui_image2 = common_vendor.resolveComponent("gui-image");
  _easycom_gui_image2();
}
const _easycom_gui_image = () => "../../Grace6/components/gui-image.js";
if (!Math) {
  (_easycom_gui_image + ZPaging)();
}
const ZPaging = () => "../../uni_modules/z-paging/components/z-paging/z-paging.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "order",
  setup(__props) {
    let orders = common_vendor.ref();
    const zPagingRef = common_vendor.ref();
    const getOrderList = async (page, limit) => {
      const res = await api_order_order.order.queryOrdeList({ page, limit });
      zPagingRef.value.complete(res.data.records);
    };
    const goToDetail = (orderNo) => {
      common_vendor.index.navigateTo({
        url: `/pages/orderDetail/orderDetail?orderNo=${orderNo}`
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(common_vendor.unref(orders), (order2, oIndex, i0) => {
          return {
            a: common_vendor.t(order2.orderNo),
            b: common_vendor.f(order2.orderDetailList, (shop, indexShop, i1) => {
              return {
                a: "93207a4f-1-" + i0 + "-" + i1 + ",93207a4f-0",
                b: common_vendor.p({
                  src: shop.itemUrl,
                  width: 100,
                  height: 100
                }),
                c: common_vendor.t(shop.itemName),
                d: common_vendor.t(shop.itemPrice),
                e: indexShop
              };
            }),
            c: common_vendor.t(order2.orderStatusName),
            d: common_vendor.t(order2.orderDate),
            e: common_vendor.t(order2.orderAmount),
            f: oIndex,
            g: common_vendor.o(($event) => goToDetail(order2.orderNo), oIndex)
          };
        }),
        b: common_vendor.sr(zPagingRef, "93207a4f-0", {
          "k": "zPagingRef"
        }),
        c: common_vendor.o(getOrderList),
        d: common_vendor.o(($event) => common_vendor.isRef(orders) ? orders.value = $event : orders = $event),
        e: common_vendor.p({
          ["paging-style"]: {
            background: "#F8F8F8"
          },
          ["show-refresher-update-time"]: true,
          ["auto-show-back-to-top"]: true,
          modelValue: common_vendor.unref(orders)
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-93207a4f"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/pages/order/order.vue"]]);
wx.createPage(MiniProgramPage);
