"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_user = require("../../stores/user.js");
const api_albums_albums = require("../../api/albums/albums.js");
require("../../utils/constant.js");
require("../../config/confjg.js");
require("../../utils/utils.js");
require("../../api/user/user.js");
require("../../utils/request.js");
require("../../api/order/order.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_gui_switch_navigation2 = common_vendor.resolveComponent("gui-switch-navigation");
  const _easycom_CollectAndHistoryTrackItemCard2 = common_vendor.resolveComponent("CollectAndHistoryTrackItemCard");
  const _easycom_BottomNav2 = common_vendor.resolveComponent("BottomNav");
  const _easycom_gui_page2 = common_vendor.resolveComponent("gui-page");
  (_easycom_uni_icons2 + _easycom_gui_switch_navigation2 + _easycom_CollectAndHistoryTrackItemCard2 + _easycom_BottomNav2 + _easycom_gui_page2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_gui_switch_navigation = () => "../../Grace6/components/gui-switch-navigation.js";
const _easycom_CollectAndHistoryTrackItemCard = () => "../../components/CollectAndHistoryTrackItemCard/CollectAndHistoryTrackItemCard.js";
const _easycom_BottomNav = () => "../../components/BottomNav/BottomNav.js";
const _easycom_gui_page = () => "../../Grace6/components/gui-page.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_gui_switch_navigation + SubscribeItemCard + _easycom_CollectAndHistoryTrackItemCard + ZPaging + _easycom_BottomNav + _easycom_gui_page)();
}
const ZPaging = () => "../../uni_modules/z-paging/components/z-paging/z-paging.js";
const SubscribeItemCard = () => "../../components/SubscribeItemCard/SubscribeItemCard.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "my",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    let { user } = common_vendor.storeToRefs(userStore);
    const zPagingRef = common_vendor.ref();
    const navItems = common_vendor.ref([
      { name: "订阅", id: "subscribe" },
      { name: "收藏", id: "collect" },
      { name: "历史", id: "history" }
    ]);
    const pageData = common_vendor.reactive({
      currentPageNav: "subscribe",
      // 订阅专辑列表
      subscribe: {
        // 专辑列表
        list: [],
        // 跳转路径
        jumpRoute: "/pages/detail/detail",
        // 弹出框配置
        popSetting: {
          type: "error",
          title: "注意",
          content: "你确定要取消订阅吗？",
          cancelText: "取消",
          confirmText: "确认"
        }
      },
      // 收藏声音列表
      collect: {
        // 声音列表
        list: [],
        // 跳转路径
        jumpRoute: "/pages/player/player",
        // 弹出框配置
        popSetting: {
          type: "error",
          title: "注意",
          content: "你确定要取消收藏吗？",
          cancelText: "取消",
          confirmText: "确认"
        }
      },
      // 历史声音列表
      history: {
        // 声音列表
        list: [],
        // 跳转路径
        jumpRoute: "/pages/player/player",
        popSetting: {
          type: "error",
          title: "注意",
          content: "你确定要删除此历史吗？",
          cancelText: "取消",
          confirmText: "确认"
        }
      }
    });
    common_vendor.ref(4);
    const navChange = (index, navItemId) => {
      pageData.currentPageNav = navItemId;
      zPagingRef.value.reload();
      console.log("navChange", index, navItemId);
    };
    const getListInfo = async (page, limit) => {
      const params = {
        page,
        limit
      };
      try {
        if (pageData.currentPageNav === "subscribe") {
          const res = await api_albums_albums.albumsService.getSubscribeAlbums(params);
          zPagingRef.value.complete(res.data.records);
        } else if (pageData.currentPageNav === "collect") {
          const res = await api_albums_albums.albumsService.getCollectTrack(params);
          zPagingRef.value.complete(res.data.records);
        } else if (pageData.currentPageNav === "history") {
          const res = await api_albums_albums.albumsService.getHistoryTrack(params);
          zPagingRef.value.complete(res.data.records);
        }
      } catch (error) {
        console.log(error);
        zPagingRef.value.complete(false);
      }
    };
    const deleteItem = (id) => {
      if (pageData.currentPageNav === "subscribe") {
        pageData.subscribe.list = pageData.subscribe.list.filter((item) => item.albumId !== id);
      } else if (pageData.currentPageNav === "collect") {
        pageData.collect.list = pageData.collect.list.filter((item) => item.trackId !== id);
      } else if (pageData.currentPageNav === "history") {
        pageData.history.list = pageData.history.list.filter((item) => item.trackId !== id);
      }
    };
    const handleGoToOtherPage = (route) => {
      if (route) {
        common_vendor.index.navigateTo({
          url: route
        });
      } else {
        common_vendor.index.showToast({
          title: "该功能暂未开放",
          icon: "none"
        });
      }
    };
    common_vendor.onLoad(async () => {
      console.log(1);
    });
    const getLiveRoom = async () => {
      common_vendor.index.showToast({
        title: "请在H5演示此功能",
        icon: "none"
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(($event) => handleGoToOtherPage("/pages/setting/setting")),
        b: common_vendor.unref(user).avatarUrl,
        c: common_vendor.t(common_vendor.unref(user).nickname),
        d: common_vendor.unref(user).isVip
      }, common_vendor.unref(user).isVip ? {
        e: common_vendor.p({
          ["custom-prefix"]: "iconfont",
          type: "VIP",
          color: "#f78414",
          size: "15"
        })
      } : {}, {
        f: common_vendor.o(($event) => handleGoToOtherPage("/pages/updateInfo/updateInfo")),
        g: common_vendor.o(($event) => handleGoToOtherPage("/pages/myWork/myWork")),
        h: common_vendor.o(getLiveRoom),
        i: common_vendor.o(($event) => handleGoToOtherPage("")),
        j: common_vendor.o(($event) => handleGoToOtherPage("/pages/wallet/wallet")),
        k: common_vendor.o(($event) => handleGoToOtherPage("/pages/order/order")),
        l: common_vendor.o((index) => navChange(index, navItems.value[index].id)),
        m: common_vendor.p({
          items: navItems.value,
          textAlign: "center",
          isCenter: true,
          size: 120,
          margin: 0,
          padding: "30rpx",
          activeDirection: "center",
          lineHeight: "50rpx",
          activeFontSize: "46rpx",
          activeLineClass: ["gui-nav-scale", "gui-gtbg-red"]
        }),
        n: pageData.currentPageNav === "subscribe"
      }, pageData.currentPageNav === "subscribe" ? {
        o: common_vendor.f(pageData[pageData.currentPageNav].list, (item, k0, i0) => {
          return {
            a: item.albumId,
            b: "2f1ef635-4-" + i0 + ",2f1ef635-2",
            c: common_vendor.p({
              data: item,
              deleteItemHandler: deleteItem,
              handleCancel: (id) => common_vendor.unref(api_albums_albums.albumsService).isSubscribeAlbum(id),
              popSetting: pageData[pageData.currentPageNav].popSetting,
              jumpRoute: pageData[pageData.currentPageNav].jumpRoute
            })
          };
        })
      } : {}, {
        p: pageData.currentPageNav === "collect"
      }, pageData.currentPageNav === "collect" ? {
        q: common_vendor.f(pageData[pageData.currentPageNav].list, (item, k0, i0) => {
          return {
            a: item.trackId,
            b: "2f1ef635-5-" + i0 + ",2f1ef635-2",
            c: common_vendor.p({
              data: item,
              deleteItemHandler: deleteItem,
              handleCancel: (id) => common_vendor.unref(api_albums_albums.albumsService).isCollectTrack(id),
              popSetting: pageData[pageData.currentPageNav].popSetting,
              mode: "collect",
              jumpRoute: pageData[pageData.currentPageNav].jumpRoute
            })
          };
        })
      } : {}, {
        r: pageData.currentPageNav === "history"
      }, pageData.currentPageNav === "history" ? {
        s: common_vendor.f(pageData[pageData.currentPageNav].list, (item, k0, i0) => {
          return {
            a: item.trackId,
            b: "2f1ef635-6-" + i0 + ",2f1ef635-2",
            c: common_vendor.p({
              data: item,
              deleteItemHandler: deleteItem,
              handleCancel: (id) => common_vendor.unref(api_albums_albums.albumsService).deleteHistoryTrack(id),
              popSetting: pageData[pageData.currentPageNav].popSetting,
              mode: "history",
              jumpRoute: pageData[pageData.currentPageNav].jumpRoute
            })
          };
        })
      } : {}, {
        t: common_vendor.sr(zPagingRef, "2f1ef635-2,2f1ef635-0", {
          "k": "zPagingRef"
        }),
        v: common_vendor.o(getListInfo),
        w: common_vendor.o(($event) => pageData[pageData.currentPageNav].list = $event),
        x: common_vendor.p({
          ["paging-style"]: {
            height: "1000rpx"
          },
          fixed: false,
          modelValue: pageData[pageData.currentPageNav].list
        }),
        y: common_vendor.p({
          customHeader: true,
          headerClass: ["gui-bg-white"],
          customFooter: true
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2f1ef635"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/pages/my/my.vue"]]);
wx.createPage(MiniProgramPage);
