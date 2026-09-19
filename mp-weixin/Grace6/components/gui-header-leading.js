"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "gui-header-leading",
  props: {
    back: { type: Boolean, default: true },
    home: { type: Boolean, default: true },
    backButtonClass: { type: Array, default: function() {
      return ["gui-primary-text"];
    } },
    homeButtonClass: { type: Array, default: function() {
      return ["gui-primary-text"];
    } }
  },
  data() {
    return {
      show: true
    };
  },
  mounted: function() {
  },
  methods: {
    goBack: function() {
      common_vendor.index.navigateBack({ delta: 1 });
      this.$emit("goBack");
    },
    goHome: function() {
      this.$emit("goHome");
    }
  },
  emits: ["goBack", "goHome"]
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.home
  }, $props.home ? {
    b: common_vendor.n($props.homeButtonClass),
    c: common_vendor.o((...args) => $options.goHome && $options.goHome(...args)),
    d: $data.show ? 1 : 0
  } : {}, {
    e: $props.back
  }, $props.back ? {
    f: common_vendor.n($props.backButtonClass),
    g: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    h: $data.show ? 1 : 0
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-0824d0b9"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/Grace6/components/gui-header-leading.vue"]]);
wx.createComponent(Component);
