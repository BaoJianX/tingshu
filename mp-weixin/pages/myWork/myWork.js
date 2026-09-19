"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../stores/user.js");
const api_albums_albums = require("../../api/albums/albums.js");
const utils_mitt = require("../../utils/mitt.js");
require("../../utils/constant.js");
require("../../config/confjg.js");
require("../../utils/utils.js");
require("../../api/user/user.js");
require("../../utils/request.js");
require("../../api/order/order.js");
if (!Array) {
  const _easycom_gui_switch_navigation2 = common_vendor.resolveComponent("gui-switch-navigation");
  const _easycom_AlbumItemCard2 = common_vendor.resolveComponent("AlbumItemCard");
  const _easycom_TrackItemCard2 = common_vendor.resolveComponent("TrackItemCard");
  (_easycom_gui_switch_navigation2 + _easycom_AlbumItemCard2 + _easycom_TrackItemCard2)();
}
const _easycom_gui_switch_navigation = () => "../../Grace6/components/gui-switch-navigation.js";
const _easycom_AlbumItemCard = () => "../../components/AlbumItemCard/AlbumItemCard.js";
const _easycom_TrackItemCard = () => "../../components/TrackItemCard/TrackItemCard.js";
if (!Math) {
  (_easycom_gui_switch_navigation + GuiSelectMenu + _easycom_AlbumItemCard + _easycom_TrackItemCard + ZPaging)();
}
const ZPaging = () => "../../uni_modules/z-paging/components/z-paging/z-paging.js";
const GuiSelectMenu = () => "../../Grace6/components/gui-select-menu.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "myWork",
  setup(__props) {
    const zPagingRef = common_vendor.ref();
    const guiSelectMenuRef = common_vendor.ref();
    const navItems = common_vendor.ref([
      { name: "专辑", id: "albumListInfo" },
      { name: "声音", id: "trackInfoListInfo" },
      { name: "视频", id: "2" },
      { name: "有声PPT", id: "3" },
      { name: "咔嚓笔记", id: "4" }
    ]);
    const pageData = common_vendor.reactive({
      currentPageNav: "albumListInfo",
      userId: 0,
      // 专辑列表
      albumListInfo: {
        // 专辑列表
        list: [],
        // 专辑新增修改路由路径
        addEditRoutePath: "/pages/createAlbum/createAlbum",
        // 状态列表
        statusList: [
          { name: "全部", status: "" },
          { name: "已通过", status: "0301" },
          { name: "未通过", status: "0302" }
        ],
        // 状态
        status: ""
      },
      // 声音列表
      trackInfoListInfo: {
        // 专辑列表
        list: [],
        // 声音新增修改路由路径
        addEditRoutePath: "/pages/createTrack/createTrack",
        // 状态列表
        statusList: [
          { name: "全部", status: "" },
          { name: "已通过", status: "0501" },
          { name: "未通过", status: "0502" }
        ],
        // 状态
        status: ""
      }
    });
    const resetSelectItems = () => {
      let index = 0;
      if (pageData.currentPageNav === "albumListInfo") {
        index = pageData.albumListInfo.statusList.findIndex((item) => item.status === pageData.albumListInfo.status);
      } else if (pageData.currentPageNav === "trackInfoListInfo") {
        index = pageData.trackInfoListInfo.statusList.findIndex((item) => item.status === pageData.trackInfoListInfo.status);
      }
      guiSelectMenuRef.value.setCurrentIndex(index !== -1 ? index : 0);
    };
    const navChange = (index, navItemId) => {
      pageData.currentPageNav = navItemId;
      resetSelectItems();
      zPagingRef.value.reload();
      console.log("navChange", index, navItemId);
    };
    const getListInfo = async (page, limit) => {
      const params = {
        page,
        limit,
        status: pageData[pageData.currentPageNav].status
      };
      console.log("===== 0. getListInfo 触发, currentPageNav:", pageData.currentPageNav, "params:", params);
      try {
        if (pageData.currentPageNav === "albumListInfo") {
          const res = await api_albums_albums.albumsService.getAlbumList(params);
          console.log("===== 1. album 请求返回 res:", res);
          console.log("===== 2. album records:", res && res.data && res.data.records);
          zPagingRef.value.complete(res.data.records);
        } else if (pageData.currentPageNav === "trackInfoListInfo") {
          const res = await api_albums_albums.albumsService.getTrackList(params);
          console.log("===== 1. track 请求返回 res:", res);
          console.log("===== 2. track records:", res && res.data && res.data.records);
          zPagingRef.value.complete(res.data.records);
        }
      } catch (error) {
        console.log("===== getListInfo 异常:", error);
        zPagingRef.value.complete(false);
      }
    };
    const deleteItem = (id) => {
      if (pageData.currentPageNav === "albumListInfo") {
        pageData.albumListInfo.list = pageData.albumListInfo.list.filter((item) => item.albumId !== id);
      } else if (pageData.currentPageNav === "trackInfoListInfo") {
        pageData.trackInfoListInfo.list = pageData.trackInfoListInfo.list.filter((item) => item.trackId !== id);
      }
    };
    const addOrEditItem = (id) => {
      const idStr = id ? `?id=${id}` : "";
      common_vendor.index.navigateTo({
        url: pageData[pageData.currentPageNav].addEditRoutePath + idStr
      });
    };
    const select = (index) => {
      pageData[pageData.currentPageNav].status = pageData[pageData.currentPageNav].statusList[index].status;
      zPagingRef.value.reload();
    };
    const reload = () => {
      resetSelectItems();
      zPagingRef.value.reload();
    };
    utils_mitt.emitter.on("reloadMyWork", function() {
      console.log("reloadMyWork");
      reload();
    });
    common_vendor.onUnmounted(() => {
      utils_mitt.emitter.off("reloadMyWork");
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o((index) => navChange(index, navItems.value[index].id)),
        b: common_vendor.p({
          textAlign: "center",
          isCenter: true,
          activeDirection: "center",
          size: 0,
          margin: 0,
          padding: "30rpx",
          activeLineHeight: "4rpx",
          activeLineWidth: "40rpx",
          items: navItems.value
        }),
        c: common_vendor.sr(guiSelectMenuRef, "0d5ca095-2,0d5ca095-0", {
          "k": "guiSelectMenuRef"
        }),
        d: common_vendor.o(select),
        e: common_vendor.p({
          items: pageData[pageData.currentPageNav].statusList.map((item) => item.name)
        }),
        f: common_vendor.o(() => addOrEditItem()),
        g: pageData.currentPageNav === "albumListInfo"
      }, pageData.currentPageNav === "albumListInfo" ? {
        h: common_vendor.f(pageData.albumListInfo.list, (item, index, i0) => {
          return {
            a: item.albumId,
            b: "0d5ca095-3-" + i0 + ",0d5ca095-0",
            c: common_vendor.p({
              data: item,
              editItemHandler: addOrEditItem,
              deleteItemHandler: deleteItem
            })
          };
        })
      } : {}, {
        i: pageData.currentPageNav === "trackInfoListInfo"
      }, pageData.currentPageNav === "trackInfoListInfo" ? {
        j: common_vendor.f(pageData.trackInfoListInfo.list, (item, index, i0) => {
          return {
            a: item.trackId,
            b: "0d5ca095-4-" + i0 + ",0d5ca095-0",
            c: common_vendor.p({
              data: item,
              editItemHandler: addOrEditItem,
              deleteItemHandler: deleteItem
            })
          };
        })
      } : {}, {
        k: common_vendor.sr(zPagingRef, "0d5ca095-0", {
          "k": "zPagingRef"
        }),
        l: common_vendor.o(getListInfo),
        m: common_vendor.o(($event) => pageData[pageData.currentPageNav].list = $event),
        n: common_vendor.p({
          ["show-refresher-update-time"]: true,
          ["auto-show-back-to-top"]: true,
          modelValue: pageData[pageData.currentPageNav].list
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0d5ca095"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/pages/myWork/myWork.vue"]]);
wx.createPage(MiniProgramPage);
