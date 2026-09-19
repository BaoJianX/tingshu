"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_user = require("../../stores/user.js");
const utils_utils = require("../../utils/utils.js");
const api_albums_albums = require("../../api/albums/albums.js");
const api_order_order = require("../../api/order/order.js");
const utils_constant = require("../../utils/constant.js");
const stores_order = require("../../stores/order.js");
require("../../api/user/user.js");
require("../../utils/request.js");
require("../../config/confjg.js");
require("../../hooks/useUpdateUserInfo.js");
if (!Array) {
  const _easycom_gui_header_leading2 = common_vendor.resolveComponent("gui-header-leading");
  const _easycom_gui_tags2 = common_vendor.resolveComponent("gui-tags");
  const _easycom_mp_html2 = common_vendor.resolveComponent("mp-html");
  const _easycom_gui_spread2 = common_vendor.resolveComponent("gui-spread");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_gui_page2 = common_vendor.resolveComponent("gui-page");
  (_easycom_gui_header_leading2 + _easycom_gui_tags2 + _easycom_mp_html2 + _easycom_gui_spread2 + _easycom_uni_icons2 + _easycom_gui_page2)();
}
const _easycom_gui_header_leading = () => "../../Grace6/components/gui-header-leading.js";
const _easycom_gui_tags = () => "../../Grace6/components/gui-tags.js";
const _easycom_mp_html = () => "../../uni_modules/mp-html/components/mp-html/mp-html.js";
const _easycom_gui_spread = () => "../../Grace6/components/gui-spread.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_gui_page = () => "../../Grace6/components/gui-page.js";
if (!Math) {
  (_easycom_gui_header_leading + _easycom_gui_tags + _easycom_mp_html + _easycom_gui_spread + _easycom_uni_icons + ZPaging + Resizable + _easycom_gui_page + GuiPopup)();
}
const GuiPopup = () => "../../Grace6/components/gui-popup.js";
const ZPaging = () => "../../uni_modules/z-paging/components/z-paging/z-paging.js";
const Resizable = () => "../../components/Resizable/Resizable.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "detail",
  props: {
    id: {
      type: Number || String,
      default: 2
    }
  },
  setup(__props) {
    const props = __props;
    const accountPopupRef = common_vendor.ref();
    const buyPopupRef = common_vendor.ref();
    const albumPopupRef = common_vendor.ref();
    const resizableRef = common_vendor.ref();
    const zPagingRef = common_vendor.ref();
    const userStore = stores_user.useUserStore();
    const orderStore = stores_order.useOrderStore();
    orderStore.clearOrderInfo();
    const albumDetailInfo = common_vendor.ref({});
    const albumTrackList = common_vendor.ref([]);
    const vipSettingList = common_vendor.ref([]);
    const trackSettingList = common_vendor.ref([]);
    const isSubscribe = common_vendor.ref(false);
    const getAlbumDetailInfo = async () => {
      try {
        const res = await api_albums_albums.albumsService.getAlbumDetail(props.id);
        albumDetailInfo.value = res.data;
      } catch (error) {
        console.log(error);
      }
    };
    const getAlbumTrackList = async (page, limit) => {
      const params = {
        page,
        limit,
        albumId: props.id
      };
      try {
        const res = await api_albums_albums.albumsService.getAlbumTrackList(params);
        res.data.records.forEach((item) => {
          item.isChecked = false;
          item.isPlaying = false;
        });
        zPagingRef.value.complete(res.data.records);
      } catch (error) {
        console.log(error);
      }
    };
    const handleTrackOnClick = async (index, item) => {
      console.log("item", item);
      if (item.isShowPaidMark) {
        if (albumDetailInfo.value.albumInfo.priceType === utils_constant.PRICE_TYPE_MAP.Single) {
          await getTrackVipSettingList(item.trackId);
          openBuyPopup();
        } else if (albumDetailInfo.value.albumInfo.priceType === utils_constant.PRICE_TYPE_MAP.Album) {
          openAlbumPopup();
        }
      } else {
        albumTrackList.value.forEach((item2, index2) => {
          if (index2 !== index) {
            item2.isChecked = false;
            item2.isPlaying = false;
          } else {
            item2.isChecked = true;
            item2.isPlaying = !item2.isPlaying;
          }
        });
        common_vendor.index.navigateTo({
          url: `/pages/player/player?albumId=${albumDetailInfo.value.albumInfo.id}&trackId=${item.trackId}`
        });
      }
    };
    const getVipSettingList = async () => {
      try {
        const res = await api_order_order.order.getVipSettingList();
        vipSettingList.value = res.data;
      } catch (error) {
        console.log(error);
      }
    };
    const getTrackVipSettingList = async (trackId) => {
      try {
        const res = await api_order_order.order.getTrackSettingList(trackId);
        res.data.forEach((item) => {
          item.trackId = trackId;
        });
        trackSettingList.value = res.data;
      } catch (error) {
        console.log(error);
      }
    };
    const handleSubscribe = async () => {
      try {
        const res = await api_albums_albums.albumsService.subscribeAlbum(albumDetailInfo.value.albumInfo.id);
        console.log("res.data", res.data);
        isSubscribe.value = res.data;
        common_vendor.index.showToast({
          title: res.data ? "订阅成功" : "取消订阅成功",
          icon: "none"
        });
      } catch (error) {
        console.log(error);
      }
    };
    const handleToOrder = () => {
      common_vendor.index.navigateTo({
        url: "/pages/confirmOrder/confirmOrder"
      });
    };
    const openAccountPopup = () => {
      console.log("openAccountPopup");
      accountPopupRef.value.open();
    };
    const openBuyPopup = () => {
      buyPopupRef.value.open();
    };
    const openAlbumPopup = () => {
      albumPopupRef.value.open();
    };
    const closeBuyPopup = () => {
      buyPopupRef.value.close();
    };
    const closeAlbumPopup = () => {
      albumPopupRef.value.close();
    };
    const closeAccountPopup = () => {
      accountPopupRef.value.close();
    };
    const handleBuyVip = (item) => {
      console.log("handleBuyVip");
      closeAccountPopup();
      orderStore.setConfirmOrderInfo({
        itemType: utils_constant.PAYMENT_ITEM_TYPE_MAP.Vip,
        itemId: item.id
      });
      handleToOrder();
    };
    const handleBuyAllIsMeanBuyVip = () => {
      console.log("handleBuyAllIsMeanBuyVip");
      closeBuyPopup();
      closeAlbumPopup();
      openAccountPopup();
    };
    const handleBuySingle = (item) => {
      console.log("handleBuySingle");
      orderStore.setConfirmOrderInfo({
        itemType: utils_constant.PAYMENT_ITEM_TYPE_MAP.Track,
        itemId: item.trackId,
        trackCount: item.trackCount
      });
      closeBuyPopup();
      handleToOrder();
    };
    const handleBuyAllAlbums = () => {
      console.log("handleBuyAllAlbums");
      orderStore.setConfirmOrderInfo({
        itemType: utils_constant.PAYMENT_ITEM_TYPE_MAP.Album,
        itemId: albumDetailInfo.value.albumInfo.id
      });
      closeAlbumPopup();
      handleToOrder();
    };
    const goHome = () => {
      common_vendor.index.redirectTo({
        url: "/pages/index/index"
      });
    };
    const getIsSubscribe = () => {
      console.log(1);
      const res = api_albums_albums.albumsService.isSubscribeAlbum(props.id);
      isSubscribe.value = res.data;
    };
    common_vendor.onLoad(() => {
      getAlbumDetailInfo();
      getVipSettingList();
      getIsSubscribe();
    });
    common_vendor.onShow(() => {
      zPagingRef.value.refresh();
    });
    return (_ctx, _cache) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
      return common_vendor.e({
        a: albumDetailInfo.value.albumInfo
      }, albumDetailInfo.value.albumInfo ? common_vendor.e({
        b: common_vendor.o(goHome),
        c: common_vendor.t(albumDetailInfo.value.albumInfo.albumTitle),
        d: albumDetailInfo.value.albumInfo.coverUrl,
        e: common_vendor.t(albumDetailInfo.value.albumInfo.albumTitle),
        f: common_vendor.f(3, (n, k0, i0) => {
          return {
            a: n,
            b: "eca06f3c-2-" + i0 + ",eca06f3c-0",
            c: common_vendor.p({
              text: albumDetailInfo.value.baseCategoryView[`category${n}Name`],
              size: 22,
              customClass: ["gui-bg-black-opacity2", "gui-color-white", "gui-m-r-5", "gui-m-b-5"]
            })
          };
        }),
        g: common_vendor.t(albumDetailInfo.value.baseCategoryView.category1Name),
        h: common_vendor.t(albumDetailInfo.value.albumStatVo.commentStatNum || 0),
        i: common_vendor.t(albumDetailInfo.value.albumStatVo.playStatNum || 0),
        j: common_vendor.t(albumDetailInfo.value.albumStatVo.subscribeStatNum || 0),
        k: common_vendor.t(albumDetailInfo.value.albumStatVo.buyStatNum || 0),
        l: common_vendor.t(albumDetailInfo.value.albumInfo.albumIntro),
        m: albumDetailInfo.value.announcer.avatarUrl,
        n: common_vendor.t(albumDetailInfo.value.announcer.nickname),
        o: common_vendor.o(() => {
        }),
        p: albumDetailInfo.value.albumInfo.albumRichIntro
      }, albumDetailInfo.value.albumInfo.albumRichIntro ? {
        q: common_vendor.p({
          content: albumDetailInfo.value.albumInfo.albumRichIntro
        }),
        r: common_vendor.p({
          height: "200rpx",
          isShrink: true
        })
      } : {}, {
        s: common_vendor.t(common_vendor.unref(userStore).user.isVip ? "续费会员 优惠多多" : "开通会员 优惠多多"),
        t: common_vendor.t(common_vendor.unref(userStore).user.isVip ? "立即续费" : "立即开通"),
        v: common_vendor.o(openAccountPopup)
      }, {}, {
        w: albumDetailInfo.value.albumInfo.isFinished === "0"
      }, albumDetailInfo.value.albumInfo.isFinished === "0" ? common_vendor.e({
        x: isSubscribe.value
      }, isSubscribe.value ? {} : {}, {
        y: common_vendor.t(isSubscribe.value ? "取消订阅" : "订阅"),
        z: common_vendor.o(handleSubscribe)
      }) : {}, {
        A: common_vendor.f(albumTrackList.value, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.orderNum),
            b: common_vendor.n(item.isChecked ? "track-item-title-checked" : "gui-color-grey1"),
            c: common_vendor.t(item.trackTitle),
            d: common_vendor.n(item.isChecked ? "track-item-title-checked" : "gui-primary-text "),
            e: item.isChecked && item.isPlaying
          }, item.isChecked && item.isPlaying ? {} : {}, {
            f: common_vendor.t(item.playStatNum),
            g: common_vendor.t(item.commentStatNum),
            h: common_vendor.t(common_vendor.unref(utils_utils.formatTime)(item.mediaDuration)),
            i: common_vendor.t(item.createTime.slice(0, 10)),
            j: item.isShowPaidMark
          }, item.isShowPaidMark ? {
            k: "eca06f3c-7-" + i0 + ",eca06f3c-6",
            l: common_vendor.p({
              ["custom-prefix"]: "iconfont",
              type: "shoufeiguanli",
              size: "15",
              color: "#ef5350"
            })
          } : {
            m: "eca06f3c-8-" + i0 + ",eca06f3c-6",
            n: common_vendor.p({
              ["custom-prefix"]: "iconfont",
              type: "xiazai",
              size: "15"
            })
          }, {
            o: common_vendor.n(item.isChecked ? "track-item-checked" : ""),
            p: common_vendor.o(($event) => handleTrackOnClick(index, item), item.trackId),
            q: item.trackId
          });
        }),
        B: common_vendor.sr(zPagingRef, "eca06f3c-6,eca06f3c-5", {
          "k": "zPagingRef"
        }),
        C: common_vendor.o(getAlbumTrackList),
        D: common_vendor.o(($event) => albumTrackList.value = $event),
        E: common_vendor.p({
          ["paging-style"]: {
            height: (((_a = resizableRef.value) == null ? void 0 : _a.boxHeight) - 50 || 100) + "px"
          },
          fixed: false,
          modelValue: albumTrackList.value
        }),
        F: common_vendor.sr(resizableRef, "eca06f3c-5,eca06f3c-0", {
          "k": "resizableRef"
        }),
        G: common_vendor.p({
          ["min-height"]: 150,
          ["max-height"]: 500,
          ["initial-height"]: 200
        }),
        H: common_vendor.o(($event) => albumDetailInfo.value = $event),
        I: common_vendor.p({
          customFooter: true,
          customHeader: true,
          modelValue: albumDetailInfo.value
        })
      }) : {}, {
        J: common_vendor.o(closeAccountPopup),
        K: common_vendor.t(common_vendor.unref(userStore).user.isVip ? "续费会员 优惠多多" : "开通会员 优惠多多"),
        L: common_vendor.f(vipSettingList.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: common_vendor.t(item.discountPrice),
            c: common_vendor.t(item.price),
            d: common_vendor.t((item.discountPrice / (item.serviceMonth * 30)).toFixed(2)),
            e: common_vendor.o(($event) => handleBuyVip(item), item.id),
            f: item.id
          };
        }),
        M: common_vendor.sr(accountPopupRef, "eca06f3c-9", {
          "k": "accountPopupRef"
        }),
        N: common_vendor.p({
          position: "bottom"
        }),
        O: common_vendor.o(closeBuyPopup),
        P: common_vendor.f(trackSettingList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: common_vendor.t(item.price),
            c: index,
            d: common_vendor.o(($event) => handleBuySingle(item), index)
          };
        }),
        Q: common_vendor.unref(userStore).user.isVip === 0 && ((_c = (_b = albumDetailInfo.value) == null ? void 0 : _b.albumInfo) == null ? void 0 : _c.payType) === common_vendor.unref(utils_constant.PAY_TYPE_MAP).VipFree
      }, common_vendor.unref(userStore).user.isVip === 0 && ((_e = (_d = albumDetailInfo.value) == null ? void 0 : _d.albumInfo) == null ? void 0 : _e.payType) === common_vendor.unref(utils_constant.PAY_TYPE_MAP).VipFree ? {
        R: common_vendor.o(handleBuyAllIsMeanBuyVip)
      } : {}, {
        S: common_vendor.t(common_vendor.unref(userStore).user.isVip ? "续费会员 优惠多多" : "开通会员 优惠多多"),
        T: common_vendor.o(handleBuyAllIsMeanBuyVip),
        U: common_vendor.sr(buyPopupRef, "eca06f3c-10", {
          "k": "buyPopupRef"
        }),
        V: common_vendor.p({
          position: "bottom"
        }),
        W: common_vendor.o(closeAlbumPopup),
        X: (_g = (_f = albumDetailInfo.value) == null ? void 0 : _f.albumInfo) == null ? void 0 : _g.coverUrl,
        Y: common_vendor.t((_i = (_h = albumDetailInfo.value) == null ? void 0 : _h.albumInfo) == null ? void 0 : _i.albumTitle),
        Z: common_vendor.t(common_vendor.unref(userStore).user.isVip ? "续费会员 优惠多多" : "开通会员 优惠多多"),
        aa: common_vendor.t(((_k = (_j = albumDetailInfo.value) == null ? void 0 : _j.albumInfo) == null ? void 0 : _k.vipDiscount) > 0 ? `会员专享：${albumDetailInfo.value.albumInfo.vipDiscount}折购买本专辑` : "可收听所有会员内容"),
        ab: common_vendor.t(common_vendor.unref(userStore).user.isVip ? "立即续费" : "立即开通"),
        ac: common_vendor.o(handleBuyAllIsMeanBuyVip),
        ad: common_vendor.t(((_m = (_l = albumDetailInfo.value) == null ? void 0 : _l.albumInfo) == null ? void 0 : _m.discount) > 0 ? `${albumDetailInfo.value.albumInfo.discount}折` : ""),
        ae: common_vendor.o(handleBuyAllAlbums),
        af: common_vendor.sr(albumPopupRef, "eca06f3c-11", {
          "k": "albumPopupRef"
        }),
        ag: common_vendor.p({
          position: "bottom"
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-eca06f3c"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/pages/detail/detail.vue"]]);
wx.createPage(MiniProgramPage);
