"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../stores/user.js");
const utils_utils = require("../../utils/utils.js");
const api_albums_albums = require("../../api/albums/albums.js");
require("../../utils/constant.js");
require("../../config/confjg.js");
require("../../api/user/user.js");
require("../../utils/request.js");
require("../../api/order/order.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_card2 = common_vendor.resolveComponent("uni-card");
  const _easycom_uni_popup_share2 = common_vendor.resolveComponent("uni-popup-share");
  const _easycom_uni_popup_dialog2 = common_vendor.resolveComponent("uni-popup-dialog");
  (_easycom_uni_icons2 + _easycom_uni_card2 + _easycom_uni_popup_share2 + _easycom_uni_popup_dialog2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_card = () => "../../uni_modules/uni-card/components/uni-card/uni-card.js";
const _easycom_uni_popup_share = () => "../../uni_modules/uni-popup/components/uni-popup-share/uni-popup-share.js";
const _easycom_uni_popup_dialog = () => "../../uni_modules/uni-popup/components/uni-popup-dialog/uni-popup-dialog.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_card + _easycom_uni_popup_share + UniPopup + _easycom_uni_popup_dialog)();
}
const UniPopup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "TrackItemCard",
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {
      }
    },
    editItemHandler: {
      type: Function,
      required: true,
      default: () => {
      }
    },
    deleteItemHandler: {
      type: Function,
      required: true,
      default: () => {
      }
    }
  },
  setup(__props) {
    const props = __props;
    const shareRef = common_vendor.ref(null);
    const deletePopUpRef = common_vendor.ref(null);
    const deleteTrackInfo = async (id) => {
      try {
        const res = await api_albums_albums.albumsService.deleteTrackInfo(id);
        console.log(res);
        props.deleteItemHandler(id);
      } catch (error) {
        console.log(error);
      }
    };
    const shareHandler = () => {
      shareRef.value.open();
    };
    return (_ctx, _cache) => {
      return {
        a: __props.data.coverUrl,
        b: common_vendor.t(__props.data.trackTitle),
        c: common_vendor.p({
          ["custom-prefix"]: "iconfont",
          type: "shichang",
          size: "15"
        }),
        d: common_vendor.t(common_vendor.unref(utils_utils.formatTime)(__props.data.mediaDuration)),
        e: common_vendor.p({
          ["custom-prefix"]: "iconfont",
          type: "erji"
        }),
        f: common_vendor.t(__props.data.playStatNum),
        g: common_vendor.p({
          ["custom-prefix"]: "iconfont",
          type: "shoucang",
          size: "12"
        }),
        h: common_vendor.t(__props.data.collectStatNum),
        i: common_vendor.p({
          ["custom-prefix"]: "iconfont",
          type: "pinglun"
        }),
        j: common_vendor.t(__props.data.commentStatNum),
        k: common_vendor.o(($event) => shareHandler()),
        l: common_vendor.o(() => __props.editItemHandler(__props.data.trackId)),
        m: common_vendor.o(($event) => deletePopUpRef.value.open()),
        n: common_vendor.sr(shareRef, "7a2e541a-5", {
          "k": "shareRef"
        }),
        o: common_vendor.p({
          type: "share",
          safeArea: true,
          backgroundColor: "#fff"
        }),
        p: common_vendor.o(() => deleteTrackInfo(__props.data.trackId)),
        q: common_vendor.p({
          type: "error",
          cancelText: "取消",
          confirmText: "确认",
          title: "注意",
          content: "你确定要删除吗？"
        }),
        r: common_vendor.sr(deletePopUpRef, "7a2e541a-7", {
          "k": "deletePopUpRef"
        }),
        s: common_vendor.p({
          type: "dialog"
        })
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/components/TrackItemCard/TrackItemCard.vue"]]);
wx.createComponent(Component);
