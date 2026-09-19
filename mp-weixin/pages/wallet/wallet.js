"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_order = require("../../stores/order.js");
const stores_user = require("../../stores/user.js");
require("../../utils/constant.js");
require("../../config/confjg.js");
require("../../api/order/order.js");
require("../../utils/request.js");
require("../../utils/utils.js");
require("../../hooks/useUpdateUserInfo.js");
require("../../api/user/user.js");
if (!Array) {
  const _easycom_gui_page2 = common_vendor.resolveComponent("gui-page");
  const _easycom_uni_popup_dialog2 = common_vendor.resolveComponent("uni-popup-dialog");
  (_easycom_gui_page2 + _easycom_uni_popup_dialog2)();
}
const _easycom_gui_page = () => "../../Grace6/components/gui-page.js";
const _easycom_uni_popup_dialog = () => "../../uni_modules/uni-popup/components/uni-popup-dialog/uni-popup-dialog.js";
if (!Math) {
  (_easycom_gui_page + GuiPopup + _easycom_uni_popup_dialog + UniPopup)();
}
const GuiPopup = () => "../../Grace6/components/gui-popup.js";
const UniPopup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "wallet",
  setup(__props) {
    const orderStore = stores_order.useOrderStore();
    const userStore = stores_user.useUserStore();
    const investPopupRef = common_vendor.ref();
    const customAmountPopupRef = common_vendor.ref();
    const investSettingsList = common_vendor.ref([
      {
        price: 10,
        name: "10元"
      },
      {
        price: 20,
        name: "20元"
      },
      {
        price: 30,
        name: "30元"
      },
      {
        price: 50,
        name: "50元"
      },
      {
        price: 100,
        name: "100元"
      }
    ]);
    const closeInvestPopup = () => {
      investPopupRef.value.close();
    };
    const handleInvest = (item) => {
      console.log(item);
      closeInvestPopup();
      orderStore.investAmount(item.price);
    };
    const openCustomAmountPopup = () => {
      closeInvestPopup();
      customAmountPopupRef.value.open();
    };
    const handleCustomizeInvest = (value) => {
      const amount = value.trim();
      const regex = /^[1-9]\d*$/;
      if (regex.test(amount)) {
        customAmountPopupRef.value.close();
        orderStore.investAmount(Number(amount));
      } else {
        common_vendor.index.showToast({
          title: "请输入正自然数",
          icon: "none"
        });
      }
    };
    common_vendor.onMounted(() => {
      userStore.getAccountBalance();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(common_vendor.unref(userStore).amount),
        b: common_vendor.o(($event) => investPopupRef.value.open()),
        c: common_vendor.o(closeInvestPopup),
        d: common_vendor.f(investSettingsList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: index,
            c: common_vendor.o(($event) => handleInvest(item), index)
          };
        }),
        e: common_vendor.o(openCustomAmountPopup),
        f: common_vendor.sr(investPopupRef, "3d5015ee-1", {
          "k": "investPopupRef"
        }),
        g: common_vendor.p({
          position: "bottom"
        }),
        h: common_vendor.sr("customAmountDialogRef", "3d5015ee-3,3d5015ee-2"),
        i: common_vendor.o(handleCustomizeInvest),
        j: common_vendor.p({
          mode: "input",
          title: "自定义金额",
          value: "",
          ["before-close"]: true,
          placeholder: "请输入正自然数"
        }),
        k: common_vendor.sr(customAmountPopupRef, "3d5015ee-2", {
          "k": "customAmountPopupRef"
        }),
        l: common_vendor.p({
          type: "dialog"
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/pages/wallet/wallet.vue"]]);
wx.createPage(MiniProgramPage);
