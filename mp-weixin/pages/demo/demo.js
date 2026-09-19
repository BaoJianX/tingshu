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
  const _easycom_gui_switch_navigation2 = common_vendor.resolveComponent("gui-switch-navigation");
  const _easycom_gui_select_menu2 = common_vendor.resolveComponent("gui-select-menu");
  const _easycom_AlbumItemCard2 = common_vendor.resolveComponent("AlbumItemCard");
  (_easycom_gui_switch_navigation2 + _easycom_gui_select_menu2 + _easycom_AlbumItemCard2)();
}
const _easycom_gui_switch_navigation = () => "../../Grace6/components/gui-switch-navigation.js";
const _easycom_gui_select_menu = () => "../../Grace6/components/gui-select-menu.js";
const _easycom_AlbumItemCard = () => "../../components/AlbumItemCard/AlbumItemCard.js";
if (!Math) {
  (_easycom_gui_switch_navigation + _easycom_gui_select_menu + _easycom_AlbumItemCard + ZPaging)();
}
const ZPaging = () => "../../uni_modules/z-paging/components/z-paging/z-paging.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "demo",
  setup(__props) {
    const zPagingRef = common_vendor.ref();
    const navItems = common_vendor.ref([
      { name: "专辑", id: "albumListInfo" },
      { name: "声音", id: "trackInfoListInfo" },
      { name: "视频", id: "2" },
      { name: "有声PPT", id: "3" },
      { name: "咔嚓笔记", id: "4" }
    ]);
    const selectItems = common_vendor.ref([
      { name: "全部", id: 0 },
      { name: "进行中", id: 1 },
      { name: "已通过", id: 2 },
      { name: "未通过", id: 3 }
    ]);
    const selectItemNames = common_vendor.ref(selectItems.value.map((item) => item.name));
    const pageData = common_vendor.reactive({
      currentPageNav: "albumListInfo",
      // 专辑列表
      albumListInfo: {
        // 状态
        status: 0,
        // 专辑列表
        list: [],
        query: { albumTitle: "", status: "", userId: 0 },
        // 专辑列表分页
        page: {
          page: 1,
          // 当前页
          limit: 10,
          // 每页条数
          total: 0,
          // 总页数
          query: { albumTitle: "", status: "", userId: 0 }
        }
      },
      // 声音列表
      trackInfoListInfo: {
        // 状态
        status: 0,
        // 专辑列表
        list: [],
        // 专辑列表分页
        page: {
          page: 1,
          limit: 10,
          query: { trackTitle: "", status: "", userId: 0 }
        }
      }
    });
    const navChange = (item, navItemId) => {
      pageData.currentPageNav = navItemId;
      zPagingRef.value.reload();
      console.log("navChange", item, navItemId);
    };
    const getListInfo = async (page, limit) => {
      const params = {
        page,
        limit
      };
      try {
        if (pageData.currentPageNav === "albumListInfo") {
          const res = await api_albums_albums.albumsService.getAlbumList({ ...params, albumInfoQuery: pageData.albumListInfo.query });
          zPagingRef.value.complete(res.data.records);
        } else if (pageData.currentPageNav === "trackInfoListInfo") {
          const res = await api_albums_albums.albumsService.getAlbumList({ ...params, albumInfoQuery: pageData.albumListInfo.query });
          zPagingRef.value.complete(res.data.records);
        }
      } catch (error) {
        console.log(error);
        zPagingRef.value.complete(false);
      }
    };
    const select = (item) => {
      console.log(item);
    };
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
        c: common_vendor.o(select),
        d: common_vendor.p({
          items: selectItemNames.value
        }),
        e: pageData.currentPageNav === "albumListInfo"
      }, pageData.currentPageNav === "albumListInfo" ? {
        f: common_vendor.f(pageData.albumListInfo.list, (item, index, i0) => {
          return {
            a: item.albumId,
            b: "d10efb47-3-" + i0 + ",d10efb47-0",
            c: common_vendor.p({
              data: item
            })
          };
        })
      } : {}, {
        g: common_vendor.sr(zPagingRef, "d10efb47-0", {
          "k": "zPagingRef"
        }),
        h: common_vendor.o(getListInfo),
        i: common_vendor.o(($event) => pageData[pageData.currentPageNav].list = $event),
        j: common_vendor.p({
          ["show-refresher-update-time"]: true,
          ["auto-show-back-to-top"]: true,
          modelValue: pageData[pageData.currentPageNav].list
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d10efb47"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/pages/demo/demo.vue"]]);
wx.createPage(MiniProgramPage);
