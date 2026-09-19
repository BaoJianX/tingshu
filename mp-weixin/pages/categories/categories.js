"use strict";
const common_vendor = require("../../common/vendor.js");
const api_category_category = require("../../api/category/category.js");
require("../../stores/user.js");
require("../../utils/request.js");
require("../../utils/utils.js");
require("../../utils/constant.js");
require("../../config/confjg.js");
require("../../api/user/user.js");
require("../../api/order/order.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "categories",
  props: {
    category1Id: {
      type: Number || String,
      required: true
    },
    // 一级分类Id
    pageTitle: {
      type: String,
      required: true
    }
    // 一级分类Id
  },
  setup(__props) {
    const props = __props;
    let scrollTop = common_vendor.ref(0);
    let oldScrollTop = common_vendor.ref(0);
    let current = common_vendor.ref(0);
    let menuHeight = common_vendor.ref(0);
    let menuItemHeight = common_vendor.ref(0);
    let itemId = common_vendor.ref("");
    const tabBar = common_vendor.ref([]);
    let navItemsHeightList = common_vendor.ref([]);
    let scrollRightTop = common_vendor.ref(0);
    const instance = common_vendor.getCurrentInstance();
    const getCategoryTree = async () => {
      try {
        const res = await api_category_category.courseService.getCategory1IdAllInfo(props.category1Id);
        tabBar.value = res.data.categoryChild || [];
      } catch (error) {
        console.log(error);
      }
    };
    const handleNavItemOnClick = (item) => {
      common_vendor.index.navigateTo({
        url: `/pages/search/search?category1Id=${props.category1Id}&category3Id=${item.categoryId}&pageTitle=${item.categoryName}`
      });
    };
    function getMenuItemTop() {
      new Promise((resolve) => {
        let selectorQuery = common_vendor.index.createSelectorQuery();
        selectorQuery.selectAll(".gui-class-item").boundingClientRect((rects) => {
          if (!rects.length) {
            setTimeout(() => {
              getMenuItemTop();
            }, 10);
            return;
          }
          rects.forEach((rect) => {
            navItemsHeightList.value.push(rect.top - rects[0].top);
            resolve();
          });
        }).exec();
      });
    }
    const switchMenu = async (index) => {
      if (navItemsHeightList.value.length === 0) {
        await getMenuItemTop();
      }
      if (index == current.value)
        return;
      scrollRightTop.value = oldScrollTop.value;
      await common_vendor.nextTick$1(() => {
        scrollRightTop.value = navItemsHeightList.value[index];
        current.value = index;
        leftMenuStatus(index);
      });
    };
    const leftMenuStatus = async (index) => {
      current.value = index;
      if (menuHeight.value === 0 || menuItemHeight.value === 0) {
        await getElRect("menu-scroll-view", "menuHeight");
        await getElRect("gui-tab-item", "menuItemHeight");
      }
      await common_vendor.nextTick$1();
      menuHeight.value = instance.proxy.menuHeight;
      menuItemHeight.value = instance.proxy.menuItemHeight;
      scrollTop.value = index * menuItemHeight.value + menuItemHeight.value / 2 - menuHeight.value / 2;
    };
    async function getElRect(elClass, dataVal) {
      new Promise((resolve, reject) => {
        const query = common_vendor.index.createSelectorQuery().in(instance);
        query.select("." + elClass).fields(
          {
            size: true
          },
          (res) => {
            if (!res) {
              setTimeout(() => {
                getElRect(elClass, dataVal);
              }, 10);
              return;
            }
            instance.proxy[dataVal] = res.height;
            resolve();
          }
        ).exec();
      });
    }
    const rightScroll = async (e) => {
      oldScrollTop.value = e.detail.scrollTop;
      if (navItemsHeightList.value.length == 0) {
        await getMenuItemTop();
      }
      if (!menuHeight.value) {
        await getElRect("menu-scroll-view", "menuHeight");
      }
      setTimeout(() => {
        let scrollHeight = e.detail.scrollTop + menuHeight.value / 2;
        for (let i = 0; i < navItemsHeightList.value.length; i++) {
          let height1 = navItemsHeightList.value[i];
          let height2 = navItemsHeightList.value[i + 1];
          if (!height2 || scrollHeight >= height1 && scrollHeight < height2) {
            leftMenuStatus(i);
            return;
          }
        }
      }, 10);
    };
    common_vendor.onMounted(async () => {
      common_vendor.index.setNavigationBarTitle({
        title: props.pageTitle || "分类"
      });
      await getCategoryTree();
      await getMenuItemTop();
      await leftMenuStatus(0);
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(tabBar.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.categoryName),
            b: index,
            c: common_vendor.n(common_vendor.unref(current) == index && "gui-tab-item-active"),
            d: common_vendor.o(($event) => switchMenu(index), index)
          };
        }),
        b: common_vendor.unref(scrollTop),
        c: common_vendor.unref(itemId),
        d: common_vendor.f(tabBar.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.categoryName),
            b: common_vendor.f(item.categoryChild, (item1, index1, i1) => {
              return {
                a: common_vendor.t(item1.categoryName),
                b: common_vendor.o(($event) => handleNavItemOnClick(item1), index1),
                c: index1
              };
            }),
            c: "item" + index,
            d: index
          };
        }),
        e: common_vendor.unref(scrollRightTop),
        f: common_vendor.o(rightScroll)
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1d71fdc2"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/pages/categories/categories.vue"]]);
wx.createPage(MiniProgramPage);
