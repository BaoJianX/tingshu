"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const uni_modules_zPaging_components_zPaging_js_zPagingStatic = require("../js/z-paging-static.js");
const uni_modules_zPaging_components_zPaging_js_zPagingUtils = require("../js/z-paging-utils.js");
const uni_modules_zPaging_components_zPaging_js_zPagingEnum = require("../js/z-paging-enum.js");
require("../js/z-paging-config.js");
require("../config/index.js");
const _sfc_main = {
  name: "z-paging-refresh",
  data() {
    return {
      R: uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.Refresher,
      isIos: common_vendor.index.getSystemInfoSync().platform === "ios",
      refresherTimeText: "",
      zTheme: {
        title: { white: "#efefef", black: "#555555" },
        arrow: { white: uni_modules_zPaging_components_zPaging_js_zPagingStatic.zStatic.base64ArrowWhite, black: uni_modules_zPaging_components_zPaging_js_zPagingStatic.zStatic.base64Arrow },
        flower: { white: uni_modules_zPaging_components_zPaging_js_zPagingStatic.zStatic.base64FlowerWhite, black: uni_modules_zPaging_components_zPaging_js_zPagingStatic.zStatic.base64Flower },
        success: { white: uni_modules_zPaging_components_zPaging_js_zPagingStatic.zStatic.base64SuccessWhite, black: uni_modules_zPaging_components_zPaging_js_zPagingStatic.zStatic.base64Success },
        indicator: { white: "#eeeeee", black: "#777777" }
      }
    };
  },
  props: [
    "status",
    "defaultThemeStyle",
    "defaultText",
    "pullingText",
    "refreshingText",
    "completeText",
    "defaultImg",
    "pullingImg",
    "refreshingImg",
    "completeImg",
    "showUpdateTime",
    "updateTimeKey",
    "imgStyle",
    "titleStyle",
    "updateTimeStyle",
    "updateTimeTextMap"
  ],
  computed: {
    ts() {
      return this.defaultThemeStyle;
    },
    statusTextArr() {
      this.updateTime();
      return [this.defaultText, this.pullingText, this.refreshingText, this.completeText];
    },
    currentTitle() {
      return this.statusTextArr[this.status] || this.defaultText;
    },
    leftImageClass() {
      if (this.status === this.R.Complete)
        return "zp-r-left-image-pre-size";
      return `zp-r-left-image zp-r-left-image-pre-size ${this.status === this.R.Default ? "zp-r-arrow-down" : "zp-r-arrow-top"}`;
    },
    leftImageStyle() {
      const showUpdateTime = this.showUpdateTime;
      const size = showUpdateTime ? "36rpx" : "30rpx";
      return { width: size, height: size, "margin-right": showUpdateTime ? "20rpx" : "9rpx" };
    },
    leftImageSrc() {
      const R = this.R;
      const status = this.status;
      if (status === R.Default) {
        if (!!this.defaultImg)
          return this.defaultImg;
        return this.zTheme.arrow[this.ts];
      } else if (status === R.ReleaseToRefresh) {
        if (!!this.pullingImg)
          return this.pullingImg;
        if (!!this.defaultImg)
          return this.defaultImg;
        return this.zTheme.arrow[this.ts];
      } else if (status === R.Loading) {
        if (!!this.refreshingImg)
          return this.refreshingImg;
        return this.zTheme.flower[this.ts];
      } else if (status === R.Complete) {
        if (!!this.completeImg)
          return this.completeImg;
        return this.zTheme.success[this.ts];
      }
      return "";
    },
    rightTextStyle() {
      let stl = {};
      stl["color"] = this.zTheme.title[this.ts];
      return stl;
    }
  },
  methods: {
    updateTime() {
      if (this.showUpdateTime) {
        this.refresherTimeText = uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.getRefesrherFormatTimeByKey(this.updateTimeKey, this.updateTimeTextMap);
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.status !== $data.R.Loading
  }, $props.status !== $data.R.Loading ? {
    b: common_vendor.n($options.leftImageClass),
    c: common_vendor.s($options.leftImageStyle),
    d: common_vendor.s($props.imgStyle),
    e: $options.leftImageSrc
  } : {
    f: common_vendor.s($options.leftImageStyle),
    g: common_vendor.s($props.imgStyle),
    h: $options.leftImageSrc
  }, {
    i: common_vendor.t($options.currentTitle),
    j: common_vendor.s($options.rightTextStyle),
    k: common_vendor.s($props.titleStyle),
    l: $props.showUpdateTime && $data.refresherTimeText.length
  }, $props.showUpdateTime && $data.refresherTimeText.length ? {
    m: common_vendor.t($data.refresherTimeText),
    n: common_vendor.s($options.rightTextStyle),
    o: common_vendor.s($props.updateTimeStyle)
  } : {}, {
    p: common_vendor.n($props.showUpdateTime ? "zp-r-container zp-r-container-padding" : "zp-r-container")
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-00a16504"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/uni_modules/z-paging/components/z-paging/components/z-paging-refresh.vue"]]);
wx.createComponent(Component);
