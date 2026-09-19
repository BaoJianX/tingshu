"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "gui-search",
  props: {
    height: { type: String, default: "66rpx" },
    customClass: { type: Array, default: function() {
      return ["gui-bg-gray", "gui-dark-bg-level-3"];
    } },
    fontSize: { type: String, default: "28rpx" },
    iconWidth: { type: String, default: "70rpx" },
    iconFontSize: { type: String, default: "30rpx" },
    inputHeight: { type: String, default: "30rpx" },
    inputFontSize: { type: String, default: "26rpx" },
    placeholder: { type: String, default: "关键字" },
    placeholderClass: { type: String, default: "" },
    kwd: { type: String, default: "" },
    borderRadius: { type: String, default: "66rpx" },
    disabled: { type: Boolean, default: false },
    focus: { type: Boolean, default: false },
    clearBtn: { type: Boolean, default: true }
  },
  data() {
    return {
      inputVal: ""
    };
  },
  created: function() {
    console.log("this.kwd--------", this.kwd);
    this.inputVal = this.kwd;
  },
  watch: {
    kwd: function(val, vo) {
      this.inputVal = val;
    }
  },
  methods: {
    clearKwd: function() {
      this.inputVal = "";
      this.$emit("clear", "");
    },
    inputting: function(e) {
      this.$emit("inputting", e.detail.value);
    },
    handleBlur: function(e) {
      this.$emit("handleBlur", e.detail.value);
    },
    confirm: function(e) {
      this.$emit("confirm", e.detail.value);
      common_vendor.index.hideKeyboard();
    },
    tapme: function() {
      this.$emit("tapme");
    }
  },
  emits: ["clear", "confirm", "tapme", "inputting", "handleBlur"]
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.tapme && $options.tapme(...args)),
    b: $props.iconFontSize,
    c: $props.height,
    d: $props.iconWidth,
    e: !$props.disabled
  }, !$props.disabled ? {
    f: $props.placeholderClass,
    g: $props.placeholder,
    h: $props.focus,
    i: $props.inputHeight,
    j: $props.inputHeight,
    k: $props.inputFontSize,
    l: common_vendor.o((...args) => $options.handleBlur && $options.handleBlur(...args)),
    m: common_vendor.o([($event) => $data.inputVal = $event.detail.value, (...args) => $options.inputting && $options.inputting(...args)]),
    n: common_vendor.o((...args) => $options.confirm && $options.confirm(...args)),
    o: $data.inputVal
  } : {}, {
    p: $props.disabled
  }, $props.disabled ? {
    q: common_vendor.t($props.placeholder),
    r: common_vendor.o((...args) => $options.tapme && $options.tapme(...args)),
    s: $props.inputHeight,
    t: $props.inputHeight,
    v: $props.inputFontSize
  } : {}, {
    w: $data.inputVal.length > 0 && $props.clearBtn
  }, $data.inputVal.length > 0 && $props.clearBtn ? {
    x: common_vendor.o((...args) => $options.clearKwd && $options.clearKwd(...args)),
    y: $props.iconFontSize,
    z: $props.height,
    A: $props.iconWidth
  } : {}, {
    B: common_vendor.n($props.customClass),
    C: $props.height,
    D: $props.borderRadius
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5f0fcaba"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/components/SearchInput/SearchInput.vue"]]);
wx.createComponent(Component);
