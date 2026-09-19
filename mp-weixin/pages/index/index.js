"use strict";
const common_vendor = require("../../common/vendor.js");
const api_category_category = require("../../api/category/category.js");
require("../../stores/user.js");
const utils_utils = require("../../utils/utils.js");
require("../../utils/request.js");
require("../../config/confjg.js");
require("../../utils/constant.js");
require("../../api/user/user.js");
require("../../api/order/order.js");
if (!Array) {
  const _easycom_gui_search2 = common_vendor.resolveComponent("gui-search");
  const _easycom_gui_switch_navigation2 = common_vendor.resolveComponent("gui-switch-navigation");
  const _easycom_gui_swiper2 = common_vendor.resolveComponent("gui-swiper");
  const _easycom_SecondaryClassificationNav2 = common_vendor.resolveComponent("SecondaryClassificationNav");
  const _easycom_GoodsCard2 = common_vendor.resolveComponent("GoodsCard");
  const _easycom_BottomNav2 = common_vendor.resolveComponent("BottomNav");
  const _easycom_gui_page2 = common_vendor.resolveComponent("gui-page");
  (_easycom_gui_search2 + _easycom_gui_switch_navigation2 + _easycom_gui_swiper2 + _easycom_SecondaryClassificationNav2 + _easycom_GoodsCard2 + _easycom_BottomNav2 + _easycom_gui_page2)();
}
const _easycom_gui_search = () => "../../Grace6/components/gui-search.js";
const _easycom_gui_switch_navigation = () => "../../Grace6/components/gui-switch-navigation.js";
const _easycom_gui_swiper = () => "../../Grace6/components/gui-swiper.js";
const _easycom_SecondaryClassificationNav = () => "../../components/SecondaryClassificationNav/SecondaryClassificationNav.js";
const _easycom_GoodsCard = () => "../../components/GoodsCard/GoodsCard.js";
const _easycom_BottomNav = () => "../../components/BottomNav/BottomNav.js";
const _easycom_gui_page = () => "../../Grace6/components/gui-page.js";
if (!Math) {
  (_easycom_gui_search + _easycom_gui_switch_navigation + _easycom_gui_swiper + _easycom_SecondaryClassificationNav + _easycom_GoodsCard + _easycom_BottomNav + _easycom_gui_page)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const swiperItems = common_vendor.ref([
      {
        img: "../../static/carousel/a.png",
        url: "",
        title: "测试标题 001",
        opentype: "navigate"
      },
      {
        img: "../../static/carousel/b.png",
        url: "",
        title: "测试标题 002",
        opentype: "navigate"
      },
      {
        img: "../../static/carousel/c.png",
        url: "",
        title: "测试标题很长很长很长很长很长很长很长很长很长很长很长很长很长很长",
        opentype: "navigate"
      }
    ]);
    const category1NavIndex = common_vendor.ref(0);
    const category1IdData = common_vendor.ref([]);
    const navItems = common_vendor.ref([]);
    const category3NavItems = common_vendor.ref([]);
    common_vendor.watchEffect(() => {
      if (navItems.value.length) {
        getCategory1IdDataInfo(navItems.value[category1NavIndex.value].id);
        getCategory3NavItems(navItems.value[category1NavIndex.value].id);
      }
    });
    const handleSearchOnClick = () => {
      console.log("handleSearchOnClick");
      common_vendor.index.navigateTo({
        url: `/pages/search/search`
      });
    };
    const getCategoryList = async () => {
      try {
        const res = await api_category_category.courseService.getAllCategory();
        utils_utils.recursionTree(res.data, "name", "categoryName", "categoryChild");
        utils_utils.recursionTree(res.data, "id", "categoryId", "categoryChild");
        utils_utils.recursionTree(res.data, "children", "categoryChild");
        navItems.value = res.data;
      } catch (error) {
        console.log(error);
      }
    };
    const getCategory1IdDataInfo = async (id) => {
      try {
        const res = await api_category_category.courseService.getCategory1IdData(id);
        category1IdData.value = res.data;
      } catch (error) {
        console.log(error);
      }
    };
    async function getCategory3NavItems(id) {
      try {
        const res = await api_category_category.courseService.getCategory1IdTopList(id);
        category3NavItems.value = res.data;
      } catch (error) {
        console.log(error);
      }
    }
    const category1NavChange = (index) => {
      category1NavIndex.value = index;
    };
    common_vendor.onMounted(() => {
      getCategoryList();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          customClass: ["gui-bg-black-opacity1"]
        }),
        b: common_vendor.o(handleSearchOnClick),
        c: common_vendor.o(category1NavChange),
        d: common_vendor.p({
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
        e: common_vendor.p({
          swiperItems: swiperItems.value,
          size: 0,
          width: 750,
          height: 330,
          indicatorActiveWidth: 38
        }),
        f: navItems.value.length
      }, navItems.value.length ? {
        g: common_vendor.p({
          navData: category3NavItems.value,
          category1Name: navItems.value[category1NavIndex.value].name,
          category1Id: navItems.value[category1NavIndex.value].id
        })
      } : {}, {
        h: common_vendor.f(category1IdData.value, (item, index, i0) => {
          return {
            a: index,
            b: "332b4334-5-" + i0 + ",332b4334-0",
            c: common_vendor.p({
              goodsData: item
            })
          };
        }),
        i: common_vendor.p({
          customHeader: true,
          customFooter: true
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
