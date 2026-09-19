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
  const _easycom_gui_page2 = common_vendor.resolveComponent("gui-page");
  const _easycom_uni_popup_dialog2 = common_vendor.resolveComponent("uni-popup-dialog");
  (_easycom_gui_page2 + _easycom_uni_popup_dialog2)();
}
const _easycom_gui_page = () => "../../Grace6/components/gui-page.js";
const _easycom_uni_popup_dialog = () => "../../uni_modules/uni-popup/components/uni-popup-dialog/uni-popup-dialog.js";
if (!Math) {
  (GuiImage + _easycom_gui_page + _easycom_uni_popup_dialog + UniPopup)();
}
const GuiImage = () => "../../Grace6/components/gui-image.js";
const UniPopup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "login",
  props: {
    redirect: {
      type: String,
      default: ""
    }
  },
  setup(__props) {
    const wxLoginDialogRef = common_vendor.ref();
    const userStore = stores_user.useUserStore();
    const openWxLoginDialog = () => {
      wxLoginDialogRef.value.open();
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          src: "../../static/logo.png",
          width: 220,
          height: 220
        }),
        b: common_vendor.o(
          //@ts-ignore
          (...args) => _ctx.loginbymsg && _ctx.loginbymsg(...args)
        ),
        c: common_vendor.o(
          //@ts-ignore
          (...args) => _ctx.submit && _ctx.submit(...args)
        ),
        d: common_vendor.o(openWxLoginDialog),
        e: common_vendor.o(common_vendor.unref(userStore).loginWithWechat),
        f: common_vendor.p({
          type: "center",
          cancelText: "取消",
          confirmText: "确定",
          title: "提示",
          content: "是否使用微信进行登陆？"
        }),
        g: common_vendor.sr(wxLoginDialogRef, "e4e4508d-2", {
          "k": "wxLoginDialogRef"
        }),
        h: common_vendor.p({
          type: "dialog"
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e4e4508d"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/pages/login/login.vue"]]);
wx.createPage(MiniProgramPage);
