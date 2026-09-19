"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../stores/user.js");
const api_albums_albums = require("../../api/albums/albums.js");
require("../../utils/constant.js");
require("../../config/confjg.js");
require("../../utils/utils.js");
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
  __name: "AlbumItemCard",
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
    const deleteAlbumInfo = async (id) => {
      try {
        const res = await api_albums_albums.albumsService.deleteAlbumInfo(id);
        console.log(res);
        props.deleteItemHandler(id);
      } catch (error) {
        console.log(error);
      }
    };
    const goToDetailsHandler = (id) => {
      common_vendor.index.navigateTo({
        url: `/pages/detail/detail?id=${id}`
      });
    };
    const shareHandler = () => {
      shareRef.value.open();
    };
    return (_ctx, _cache) => {
      return {
        a: __props.data.coverUrl,
        b: common_vendor.t(__props.data.albumTitle),
        c: common_vendor.p({
          ["custom-prefix"]: "iconfont",
          type: "shengyin_o"
        }),
        d: common_vendor.t(__props.data.includeTrackCount),
        e: common_vendor.p({
          ["custom-prefix"]: "iconfont",
          type: "erji"
        }),
        f: common_vendor.t(__props.data.playStatNum),
        g: common_vendor.p({
          ["custom-prefix"]: "iconfont",
          type: "gouwuche3"
        }),
        h: common_vendor.t(__props.data.buyStatNum),
        i: common_vendor.p({
          ["custom-prefix"]: "iconfont",
          type: "pinglun"
        }),
        j: common_vendor.t(__props.data.commentStatNum),
        k: common_vendor.o(($event) => shareHandler()),
        l: common_vendor.o(() => goToDetailsHandler(__props.data.albumId)),
        m: common_vendor.o(() => __props.editItemHandler(__props.data.albumId)),
        n: common_vendor.o(($event) => deletePopUpRef.value.open()),
        o: common_vendor.sr(shareRef, "45f2f362-5", {
          "k": "shareRef"
        }),
        p: common_vendor.p({
          type: "share",
          safeArea: true,
          backgroundColor: "#fff"
        }),
        q: common_vendor.o(() => deleteAlbumInfo(__props.data.albumId)),
        r: common_vendor.p({
          type: "error",
          cancelText: "取消",
          confirmText: "确认",
          title: "注意",
          content: "你确定要删除吗？"
        }),
        s: common_vendor.sr(deletePopUpRef, "45f2f362-7", {
          "k": "deletePopUpRef"
        }),
        t: common_vendor.p({
          type: "dialog"
        })
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/components/AlbumItemCard/AlbumItemCard.vue"]]);
wx.createComponent(Component);
