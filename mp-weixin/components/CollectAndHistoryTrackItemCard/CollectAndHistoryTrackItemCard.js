"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_utils = require("../../utils/utils.js");
require("../../utils/constant.js");
require("../../config/confjg.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_card2 = common_vendor.resolveComponent("uni-card");
  const _easycom_uni_popup_dialog2 = common_vendor.resolveComponent("uni-popup-dialog");
  (_easycom_uni_icons2 + _easycom_uni_card2 + _easycom_uni_popup_dialog2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_card = () => "../../uni_modules/uni-card/components/uni-card/uni-card.js";
const _easycom_uni_popup_dialog = () => "../../uni_modules/uni-popup/components/uni-popup-dialog/uni-popup-dialog.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_card + _easycom_uni_popup_dialog + UniPopup)();
}
const UniPopup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "CollectAndHistoryTrackItemCard",
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
    mode: {
      type: String,
      default: "collect"
    },
    jumpRoute: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const cancelPopUpRef = common_vendor.ref();
    const handleCancel = async (albumId) => {
      try {
        const res = await props.handleCancel(albumId);
        props.deleteItemHandler(albumId);
      } catch (error) {
      }
    };
    const handleJump = () => {
      common_vendor.index.navigateTo({
        url: `${props.jumpRoute}?albumId=${props.data.albumId}&trackId=${props.data.trackId}`
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.data.coverUrl,
        b: common_vendor.o(handleJump),
        c: common_vendor.t(__props.data.trackTitle),
        d: __props.mode === "collect"
      }, __props.mode === "collect" ? {
        e: common_vendor.t(__props.data.createTime.slice(0, 10))
      } : {}, {
        f: __props.mode === "history"
      }, __props.mode === "history" ? {
        g: common_vendor.t(__props.data.albumTitle)
      } : {}, {
        h: __props.mode === "history"
      }, __props.mode === "history" ? {
        i: common_vendor.p({
          ["custom-prefix"]: "iconfont",
          type: "shichang",
          size: "15"
        }),
        j: common_vendor.t(common_vendor.unref(utils_utils.formatTime)(__props.data.mediaDuration)),
        k: common_vendor.t(__props.data.playRate)
      } : {}, {
        l: common_vendor.o(handleJump),
        m: common_vendor.o(($event) => cancelPopUpRef.value.open()),
        n: common_vendor.p({
          ["custom-prefix"]: "iconfont",
          type: "shanchu",
          size: "15"
        }),
        o: common_vendor.p({
          margin: "5px",
          padding: "5px",
          spacing: "3px"
        }),
        p: common_vendor.o(() => handleCancel(__props.mode === "collect" ? __props.data.trackId : __props.data.id)),
        q: common_vendor.p({
          type: __props.popSetting.type,
          cancelText: __props.popSetting.cancelText,
          confirmText: __props.popSetting.confirmText,
          title: __props.popSetting.title,
          content: __props.popSetting.content
        }),
        r: common_vendor.sr(cancelPopUpRef, "4a3264a2-3", {
          "k": "cancelPopUpRef"
        }),
        s: common_vendor.p({
          type: "dialog"
        })
      });
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4a3264a2"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/components/CollectAndHistoryTrackItemCard/CollectAndHistoryTrackItemCard.vue"]]);
wx.createComponent(Component);
