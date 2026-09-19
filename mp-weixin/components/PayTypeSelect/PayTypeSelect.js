"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_constant = require("../../utils/constant.js");
const stores_order = require("../../stores/order.js");
require("../../config/confjg.js");
require("../../stores/user.js");
require("../../utils/utils.js");
require("../../api/user/user.js");
require("../../utils/request.js");
require("../../api/order/order.js");
require("../../hooks/useUpdateUserInfo.js");
if (!Math) {
  GuiPopup();
}
const GuiPopup = () => "../../Grace6/components/gui-popup.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "PayTypeSelect",
  props: {
    wechatSetting: {
      // payMode 支付模式 0正常订单支付 1通过订单号支付
      type: Object,
      default: () => ({ isShow: true, payMode: 0 })
    },
    alipaySetting: {
      // payMode 支付模式 0正常订单支付 1通过订单号支付
      type: Object,
      default: () => ({ isShow: true, payMode: 0 })
    },
    balanceSetting: {
      // payMode 支付模式 0正常订单支付 1通过订单号支付
      type: Object,
      default: () => ({ isShow: true, payMode: 0 })
    }
  },
  setup(__props, { expose }) {
    var _a, _b, _c, _d, _e, _f;
    const props = __props;
    const popupRef = common_vendor.ref();
    const orderStore = stores_order.useOrderStore();
    const bottomData = common_vendor.ref([
      {
        text: "微信",
        icon: "../../static/weixin.png",
        payWay: utils_constant.PAY_WAY_MAP.WeChat,
        isShow: (_a = props.wechatSetting) == null ? void 0 : _a.isShow,
        payMode: (_b = props.wechatSetting) == null ? void 0 : _b.payMode
      },
      {
        text: "支付宝",
        icon: "../../static/zhifubao.png",
        payWay: utils_constant.PAY_WAY_MAP.Alipay,
        isShow: (_c = props.alipaySetting) == null ? void 0 : _c.isShow,
        payMode: (_d = props.alipaySetting) == null ? void 0 : _d.payMode
      },
      {
        text: "余额",
        icon: "../../static/logo.png",
        payWay: utils_constant.PAY_WAY_MAP.Balance,
        isShow: (_e = props.balanceSetting) == null ? void 0 : _e.isShow,
        payMode: (_f = props.balanceSetting) == null ? void 0 : _f.payMode
      }
    ]);
    const open = () => {
      console.log("支付方式弹窗弹出");
      popupRef.value.open();
    };
    const close = () => {
      popupRef.value.close();
    };
    const handleSelect = (item) => {
      orderStore.setOrderPayWay(item.payWay);
      if (item.payMode === 0 || item.payMode === void 0) {
        orderStore.submitOrder();
      } else if (item.payMode === 1) {
        orderStore.submitOrderForOrderNumber();
      }
      close();
    };
    expose({ open, close });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(bottomData.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.isShow
          }, item.isShow ? {
            b: item.icon,
            c: common_vendor.t(item.text),
            d: common_vendor.o(($event) => handleSelect(item), index)
          } : {}, {
            e: index
          });
        }),
        b: common_vendor.o(close),
        c: common_vendor.sr(popupRef, "f3e66e0c-0", {
          "k": "popupRef"
        }),
        d: common_vendor.p({
          position: "bottom"
        })
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/components/PayTypeSelect/PayTypeSelect.vue"]]);
wx.createComponent(Component);
