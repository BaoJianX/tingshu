"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_user = require("../../stores/user.js");
require("../../utils/constant.js");
require("../../config/confjg.js");
require("../../utils/utils.js");
require("../../api/user/user.js");
require("../../utils/request.js");
require("../../api/order/order.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_section2 = common_vendor.resolveComponent("uni-section");
  const _easycom_gui_page2 = common_vendor.resolveComponent("gui-page");
  const _easycom_uni_popup_dialog2 = common_vendor.resolveComponent("uni-popup-dialog");
  (_easycom_uni_icons2 + _easycom_uni_section2 + _easycom_gui_page2 + _easycom_uni_popup_dialog2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_section = () => "../../uni_modules/uni-section/components/uni-section/uni-section.js";
const _easycom_gui_page = () => "../../Grace6/components/gui-page.js";
const _easycom_uni_popup_dialog = () => "../../uni_modules/uni-popup/components/uni-popup-dialog/uni-popup-dialog.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_section + _easycom_gui_page + _easycom_uni_popup_dialog + UniPopup)();
}
const UniPopup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "setting",
  props: {
    redirect: {
      type: String,
      default: ""
    }
  },
  setup(__props) {
    const dialogRef = common_vendor.ref();
    const userStore = stores_user.useUserStore();
    const openDialog = () => {
      dialogRef.value.open();
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          type: "forward",
          size: "20"
        }),
        b: common_vendor.p({
          title: "退出登陆",
          type: "line"
        }),
        c: common_vendor.o(openDialog),
        d: common_vendor.o(common_vendor.unref(userStore).logout),
        e: common_vendor.p({
          type: "center",
          cancelText: "取消",
          confirmText: "确定",
          title: "提示",
          content: "是否退出登陆？"
        }),
        f: common_vendor.sr(dialogRef, "018cdf56-3", {
          "k": "dialogRef"
        }),
        g: common_vendor.p({
          type: "dialog"
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-018cdf56"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/pages/setting/setting.vue"]]);
wx.createPage(MiniProgramPage);
