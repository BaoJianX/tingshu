"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "gui-tags",
  props: {
    width: { type: Number, default: 0 },
    text: { type: String, default: "" },
    size: { type: Number, default: 26 },
    lineHeight: { type: Number, default: 1.8 },
    padding: { type: Number, default: 15 },
    margin: { type: Number, default: 15 },
    customClass: { type: Array, default: function() {
      return ["gui-bg-primary", "gui-color-white"];
    } },
    borderRadius: { type: Number, default: 6 },
    data: { type: Array, default: function() {
      return [];
    } },
    borderColor: { type: String, default: "rgba(255,255,255,0)" }
  },
  data() {
    return {
      tapping: false
    };
  },
  methods: {
    tapme: function() {
      this.$emit("tapme", this.data);
    }
  },
  emits: ["tapme"]
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($props.text),
    b: common_vendor.n($props.customClass),
    c: $props.width == 0 ? "" : $props.width + "rpx",
    d: $props.padding + "rpx",
    e: $props.padding + "rpx",
    f: $props.size * $props.lineHeight + "rpx",
    g: $props.size * $props.lineHeight + "rpx",
    h: $props.size + "rpx",
    i: $props.borderRadius + "rpx",
    j: $props.margin + "rpx",
    k: $props.margin + "rpx",
    l: $props.borderColor + " !important",
    m: common_vendor.o((...args) => $options.tapme && $options.tapme(...args))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-d4c871d4"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/Grace6/components/gui-tags.vue"]]);
wx.createComponent(Component);
