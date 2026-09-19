"use strict";
const uni_modules_zPaging_components_zPaging_js_zPagingStatic = require("../js/z-paging-static.js");
const uni_modules_zPaging_components_zPaging_js_zPagingEnum = require("../js/z-paging-enum.js");
const common_vendor = require("../../../../../common/vendor.js");
const _sfc_main = {
  name: "z-paging-load-more",
  data() {
    return {
      M: uni_modules_zPaging_components_zPaging_js_zPagingEnum.Enum.More,
      zTheme: {
        title: { white: "#efefef", black: "#a4a4a4" },
        line: { white: "#efefef", black: "#eeeeee" },
        circleBorder: { white: "#aaaaaa", black: "#c8c8c8" },
        circleBorderTop: { white: "#ffffff", black: "#444444" },
        flower: { white: uni_modules_zPaging_components_zPaging_js_zPagingStatic.zStatic.base64FlowerWhite, black: uni_modules_zPaging_components_zPaging_js_zPagingStatic.zStatic.base64Flower },
        indicator: { white: "#eeeeee", black: "#777777" }
      }
    };
  },
  props: ["zConfig"],
  computed: {
    ts() {
      return this.c.defaultThemeStyle;
    },
    c() {
      return this.zConfig;
    },
    ownLoadingMoreText() {
      const statusTextArr = [this.c.defaultText, this.c.loadingText, this.c.noMoreText, this.c.failText];
      return statusTextArr[this.finalStatus];
    },
    finalStatus() {
      if (this.c.defaultAsLoading && this.c.status === this.M.Default)
        return this.M.Loading;
      return this.c.status;
    },
    finalLoadingIconType() {
      return this.c.loadingIconType;
    }
  },
  methods: {
    doClick() {
      this.$emit("doClick");
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$options.c.hideContent
  }, !$options.c.hideContent ? common_vendor.e({
    b: $options.c.showNoMoreLine && $options.finalStatus === $data.M.NoMore
  }, $options.c.showNoMoreLine && $options.finalStatus === $data.M.NoMore ? {
    c: common_vendor.s({
      backgroundColor: $data.zTheme.line[$options.ts]
    }),
    d: common_vendor.s($options.c.noMoreLineCustomStyle)
  } : {}, {
    e: $options.finalStatus === $data.M.Loading && !!$options.c.loadingIconCustomImage
  }, $options.finalStatus === $data.M.Loading && !!$options.c.loadingIconCustomImage ? {
    f: $options.c.loadingIconCustomImage,
    g: common_vendor.s($options.c.iconCustomStyle),
    h: $options.c.loadingAnimated ? 1 : ""
  } : {}, {
    i: $options.finalStatus === $data.M.Loading && $options.finalLoadingIconType === "flower" && !$options.c.loadingIconCustomImage.length
  }, $options.finalStatus === $data.M.Loading && $options.finalLoadingIconType === "flower" && !$options.c.loadingIconCustomImage.length ? {
    j: common_vendor.s($options.c.iconCustomStyle),
    k: $data.zTheme.flower[$options.ts]
  } : {}, {
    l: $options.finalStatus === $data.M.Loading && $options.finalLoadingIconType === "circle" && !$options.c.loadingIconCustomImage.length
  }, $options.finalStatus === $data.M.Loading && $options.finalLoadingIconType === "circle" && !$options.c.loadingIconCustomImage.length ? {
    m: common_vendor.s({
      borderColor: $data.zTheme.circleBorder[$options.ts],
      borderTopColor: $data.zTheme.circleBorderTop[$options.ts]
    }),
    n: common_vendor.s($options.c.iconCustomStyle)
  } : {}, {
    o: common_vendor.t($options.ownLoadingMoreText),
    p: common_vendor.s({
      color: $data.zTheme.title[$options.ts]
    }),
    q: common_vendor.s($options.c.titleCustomStyle),
    r: $options.c.showNoMoreLine && $options.finalStatus === $data.M.NoMore
  }, $options.c.showNoMoreLine && $options.finalStatus === $data.M.NoMore ? {
    s: common_vendor.s({
      backgroundColor: $data.zTheme.line[$options.ts]
    }),
    t: common_vendor.s($options.c.noMoreLineCustomStyle)
  } : {}) : {}, {
    v: common_vendor.s($options.c.customStyle),
    w: common_vendor.o((...args) => $options.doClick && $options.doClick(...args))
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-8cc5c400"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/uni_modules/z-paging/components/z-paging/components/z-paging-load-more.vue"]]);
wx.createComponent(Component);
