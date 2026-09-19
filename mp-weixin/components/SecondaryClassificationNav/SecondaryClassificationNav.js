"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "SecondaryClassificationNav",
  props: {
    navData: {
      type: Array,
      required: true,
      default: []
    },
    category1Id: {
      type: Number || String,
      required: true
    },
    category1Name: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const handleNavItemOnClick = (item) => {
      console.log("handleNavItemOnClick", item.category2Id);
      common_vendor.index.navigateTo({
        url: `/pages/search/search?category1Id=${props.category1Id}&category2Id=${item.category2Id}&category3Id=${item.id}&pageTitle=${item.name}`
      });
    };
    const goToCategoryPage = () => {
      common_vendor.index.navigateTo({
        url: `/pages/categories/categories?category1Id=${props.category1Id}&pageTitle=${props.category1Name}`
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(__props.navData, (item, index, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: index,
            c: common_vendor.o(($event) => handleNavItemOnClick(item), index)
          };
        }),
        b: common_vendor.o(goToCategoryPage)
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-bf8272ae"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/components/SecondaryClassificationNav/SecondaryClassificationNav.vue"]]);
wx.createComponent(Component);
