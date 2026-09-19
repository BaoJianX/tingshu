"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_constant = require("../../utils/constant.js");
const utils_utils = require("../../utils/utils.js");
require("../../config/confjg.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_card2 = common_vendor.resolveComponent("uni-card");
  (_easycom_uni_icons2 + _easycom_uni_card2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_card = () => "../../uni_modules/uni-card/components/uni-card/uni-card.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_card)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "SearchResultsItem",
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {
      }
    }
  },
  setup(__props) {
    const props = __props;
    const handleGoToDetails = () => {
      common_vendor.index.navigateTo({
        url: `/pages/detail/detail?id=${props.data.id}`
      });
    };
    const replaceTitle = (title) => {
      return title.replace(/<font color='(.+?)'>/gi, '<font style="color:$1">');
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(common_vendor.unref(utils_utils.getNameByValue)(common_vendor.unref(utils_constant.PAY_TYPE), __props.data.payType)),
        b: __props.data.coverUrl,
        c: __props.data.isFinished === "1"
      }, __props.data.isFinished === "1" ? {
        d: common_vendor.p({
          ["custom-prefix"]: "iconfont",
          type: "wanjie",
          color: "#ff6e40",
          size: "25"
        })
      } : {}, {
        e: replaceTitle(__props.data.albumTitle),
        f: common_vendor.t(__props.data.albumIntro),
        g: common_vendor.p({
          ["custom-prefix"]: "iconfont",
          type: "shengyin_o"
        }),
        h: common_vendor.t(__props.data.includeTrackCount),
        i: common_vendor.p({
          ["custom-prefix"]: "iconfont",
          type: "erji"
        }),
        j: common_vendor.t(__props.data.playStatNum),
        k: common_vendor.o(handleGoToDetails),
        l: common_vendor.p({
          padding: "5rpx"
        })
      });
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2db5162c"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/components/SearchResultsItem/SearchResultsItem.vue"]]);
wx.createComponent(Component);
