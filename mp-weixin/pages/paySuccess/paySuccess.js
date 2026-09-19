"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _component_t_icon = common_vendor.resolveComponent("t-icon");
  _component_t_icon();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "paySuccess",
  props: {
    orderNo: {
      type: String,
      default: ""
    }
  },
  setup(__props) {
    const props = __props;
    const onTapReturn = (mode) => {
      console.log(mode);
      if (mode === 1) {
        common_vendor.index.navigateTo({
          url: `/pages/orderDetail/orderDetail?orderNo=${props.orderNo}`
        });
      } else {
        common_vendor.index.navigateBack();
      }
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          name: "check-circle-filled",
          size: "60rpx",
          color: "#47D368"
        }),
        b: common_vendor.o(($event) => onTapReturn(1)),
        c: common_vendor.o(($event) => onTapReturn(2))
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-178829e8"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/pages/paySuccess/paySuccess.vue"]]);
wx.createPage(MiniProgramPage);
