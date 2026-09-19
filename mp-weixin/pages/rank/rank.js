"use strict";
const common_vendor = require("../../common/vendor.js");
const api_category_category = require("../../api/category/category.js");
const api_albums_albums = require("../../api/albums/albums.js");
require("../../stores/user.js");
const utils_utils = require("../../utils/utils.js");
require("../../utils/request.js");
require("../../config/confjg.js");
require("../../utils/constant.js");
require("../../api/user/user.js");
require("../../api/order/order.js");
if (!Array) {
  const _easycom_gui_switch_navigation2 = common_vendor.resolveComponent("gui-switch-navigation");
  const _easycom_BottomNav2 = common_vendor.resolveComponent("BottomNav");
  const _easycom_gui_page2 = common_vendor.resolveComponent("gui-page");
  (_easycom_gui_switch_navigation2 + _easycom_BottomNav2 + _easycom_gui_page2)();
}
const _easycom_gui_switch_navigation = () => "../../Grace6/components/gui-switch-navigation.js";
const _easycom_BottomNav = () => "../../components/BottomNav/BottomNav.js";
const _easycom_gui_page = () => "../../Grace6/components/gui-page.js";
if (!Math) {
  (_easycom_gui_switch_navigation + SearchResultsItem + ZPagingEmptyView + _easycom_BottomNav + _easycom_gui_page)();
}
const SearchResultsItem = () => "../../components/SearchResultsItem/SearchResultsItem.js";
const ZPagingEmptyView = () => "../../uni_modules/z-paging/components/z-paging-empty-view/z-paging-empty-view.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "rank",
  setup(__props) {
    const category1NavIndex = common_vendor.ref(0);
    const category1Id = common_vendor.ref();
    const rankList = common_vendor.ref([]);
    const navItems = common_vendor.ref([]);
    const tabbarItems = [
      { name: "热度", dimension: "hotScore" },
      { name: "播放量", dimension: "playStatNum" },
      { name: "订阅量", dimension: "subscribeStatNum" },
      { name: "购买量", dimension: "buyStatNum" },
      { name: "评论数", dimension: "commentStatNum" }
    ];
    let scrollTop = common_vendor.ref(0);
    let dimension = common_vendor.ref("hotScore");
    common_vendor.watchEffect(() => {
      if (navItems.value.length)
        ;
    });
    const switchMenu = (current) => {
      if (current === dimension.value) {
        return;
      }
      dimension.value = current;
      getRankList();
    };
    const getCategoryList = async () => {
      try {
        const res = await api_category_category.courseService.getAllCategory();
        utils_utils.recursionTree(res.data, "name", "categoryName", "categoryChild");
        utils_utils.recursionTree(res.data, "id", "categoryId", "categoryChild");
        utils_utils.recursionTree(res.data, "children", "categoryChild");
        category1Id.value = res.data[0].id;
        navItems.value = res.data;
        getRankList();
      } catch (error) {
        console.log(error);
      }
    };
    const getRankList = async () => {
      const res = await api_albums_albums.albumsService.findRankingList(category1Id.value, dimension.value);
      rankList.value = res.data;
    };
    const category1NavChange = (index) => {
      category1NavIndex.value = index;
      category1Id.value = navItems.value[index].id;
      getRankList();
    };
    common_vendor.onMounted(() => {
      getCategoryList();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(category1NavChange),
        b: common_vendor.p({
          items: navItems.value,
          currentIndex: category1NavIndex.value,
          textAlign: "center",
          isCenter: true,
          activeDirection: "center",
          size: 0,
          margin: 10,
          padding: "30rpx",
          activeLineHeight: "4rpx",
          width: 750
        }),
        c: common_vendor.f(tabbarItems, (item, index, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: index,
            c: common_vendor.n(common_vendor.unref(dimension) == item.dimension && "gui-tab-item-active"),
            d: common_vendor.o(($event) => switchMenu(item.dimension), index)
          };
        }),
        d: common_vendor.unref(scrollTop),
        e: rankList.value
      }, rankList.value ? {
        f: common_vendor.f(rankList.value, (item, k0, i0) => {
          return {
            a: item.id,
            b: "716fbf2c-2-" + i0 + ",716fbf2c-0",
            c: common_vendor.p({
              data: item
            })
          };
        })
      } : {}, {
        g: common_vendor.p({
          customFooter: true,
          customHeader: true
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-716fbf2c"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/pages/rank/rank.vue"]]);
wx.createPage(MiniProgramPage);
