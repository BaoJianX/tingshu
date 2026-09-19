"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_constant = require("../../utils/constant.js");
require("../../config/confjg.js");
if (!Array) {
  const _easycom_gui_image2 = common_vendor.resolveComponent("gui-image");
  _easycom_gui_image2();
}
const _easycom_gui_image = () => "../../Grace6/components/gui-image.js";
if (!Math) {
  _easycom_gui_image();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "GoodsCard",
  props: {
    goodsData: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  setup(__props) {
    const props = __props;
    const payTypeList = common_vendor.ref(utils_constant.PAY_TYPE);
    const payTypeMap = common_vendor.computed(() => {
      const map = {};
      payTypeList.value.forEach((item) => {
        map[item.value] = item.name;
      });
      return map;
    });
    const gotoGoodInfo = (index, item) => {
      console.log(index, item);
      common_vendor.index.navigateTo({
        url: `/pages/detail/detail?id=${item.id}`
      });
    };
    const handleViewAll = () => {
      console.log("查看全部");
      common_vendor.index.navigateTo({
        url: `/pages/search/search?category1Id=${props.goodsData.list[0].category1Id}&category2Id=${props.goodsData.list[0].category2Id}&category3Id=${props.goodsData.list[0].category3Id}&pageTitle=${props.goodsData.baseCategory3.name}`
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(__props.goodsData.baseCategory3.name),
        b: common_vendor.o(handleViewAll),
        c: common_vendor.f(__props.goodsData.list, (item, index, i0) => {
          return {
            a: common_vendor.t(common_vendor.unref(payTypeMap)[item.payType]),
            b: common_vendor.t(item.playStatNum),
            c: "dd8935df-0-" + i0,
            d: common_vendor.p({
              src: item.coverUrl,
              width: 220,
              height: 220
            }),
            e: common_vendor.t(item.albumTitle),
            f: index,
            g: common_vendor.o(($event) => gotoGoodInfo(index, item), index)
          };
        })
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-dd8935df"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/components/GoodsCard/GoodsCard.vue"]]);
wx.createComponent(Component);
