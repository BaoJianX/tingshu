"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_gui_tags2 = common_vendor.resolveComponent("gui-tags");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_card2 = common_vendor.resolveComponent("uni-card");
  const _easycom_uni_popup_dialog2 = common_vendor.resolveComponent("uni-popup-dialog");
  (_easycom_gui_tags2 + _easycom_uni_icons2 + _easycom_uni_card2 + _easycom_uni_popup_dialog2)();
}
const _easycom_gui_tags = () => "../../Grace6/components/gui-tags.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_card = () => "../../uni_modules/uni-card/components/uni-card/uni-card.js";
const _easycom_uni_popup_dialog = () => "../../uni_modules/uni-popup/components/uni-popup-dialog/uni-popup-dialog.js";
if (!Math) {
  (_easycom_gui_tags + _easycom_uni_icons + _easycom_uni_card + _easycom_uni_popup_dialog + UniPopup)();
}
const UniPopup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "SubscribeItemCard",
  props: {
    // 分类导航
    data: {
      type: Object,
      required: true,
      default: () => {
        return {};
      }
    },
    deleteItemHandler: {
      type: Function,
      required: true,
      default: () => {
      }
    },
    handleCancel: {
      type: Function,
      default: () => {
      }
    },
    popSetting: {
      type: Object,
      required: true,
      default: () => {
        return {
          type: "error",
          title: "注意",
          content: "你确定要取消订阅吗？",
          cancelText: "取消",
          confirmText: "确认"
        };
      }
    },
    jumpRoute: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const cancelSubscribePopUpRef = common_vendor.ref();
    const handleCancel = async (albumId) => {
      console.log("取消订阅", albumId);
      try {
        const res = await props.handleCancel(albumId);
        console.log("res", res);
        props.deleteItemHandler(albumId);
      } catch (error) {
      }
    };
    const handleJump = () => {
      let id = props.data.albumId ? `?id=${props.data.albumId}` : "";
      common_vendor.index.navigateTo({
        url: props.jumpRoute + id
      });
    };
    return (_ctx, _cache) => {
      var _a, _b;
      return common_vendor.e({
        a: __props.data.coverUrl,
        b: common_vendor.o(handleJump),
        c: common_vendor.t(__props.data.albumTitle),
        d: common_vendor.t(__props.data.createTime.slice(0, 10)),
        e: ((_a = __props.data) == null ? void 0 : _a.isFinished) === "1"
      }, ((_b = __props.data) == null ? void 0 : _b.isFinished) === "1" ? {
        f: common_vendor.p({
          text: "完结",
          size: 22,
          width: 50,
          borderColor: "#FF0036",
          customClass: ["gui-transparent-bg", "gui-color-red", "gui-m-t-10"]
        })
      } : {}, {
        g: common_vendor.o(handleJump),
        h: common_vendor.o(($event) => cancelSubscribePopUpRef.value.open()),
        i: common_vendor.p({
          ["custom-prefix"]: "iconfont",
          type: "shanchu",
          size: "15"
        }),
        j: common_vendor.p({
          margin: "5px",
          padding: "5px",
          spacing: "3px"
        }),
        k: common_vendor.o(() => handleCancel(__props.data.albumId)),
        l: common_vendor.p({
          type: __props.popSetting.type,
          cancelText: __props.popSetting.cancelText,
          confirmText: __props.popSetting.confirmText,
          title: __props.popSetting.title,
          content: __props.popSetting.content
        }),
        m: common_vendor.sr(cancelSubscribePopUpRef, "9640d07a-3", {
          "k": "cancelSubscribePopUpRef"
        }),
        n: common_vendor.p({
          type: "dialog"
        })
      });
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9640d07a"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/components/SubscribeItemCard/SubscribeItemCard.vue"]]);
wx.createComponent(Component);
