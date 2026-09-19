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
    confirm: function(e) {
      this.$emit("confirm", e.detail.value);
      common_vendor.index.hideKeyboard();
    },
    tapme: function() {
      this.$emit("tapme");
    }
  },
  emits: ["clear", "confirm", "tapme", "inputting"]
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
    l: common_vendor.o([($event) => $data.inputVal = $event.detail.value, (...args) => $options.inputting && $options.inputting(...args)]),
    m: common_vendor.o((...args) => $options.confirm && $options.confirm(...args)),
    n: $data.inputVal
  } : {}, {
    o: $props.disabled
  }, $props.disabled ? {
    p: common_vendor.t($props.placeholder),
    q: common_vendor.o((...args) => $options.tapme && $options.tapme(...args)),
    r: $props.inputHeight,
    s: $props.inputHeight,
    t: $props.inputFontSize
  } : {}, {
    v: $data.inputVal.length > 0 && $props.clearBtn
  }, $data.inputVal.length > 0 && $props.clearBtn ? {
    w: common_vendor.o((...args) => $options.clearKwd && $options.clearKwd(...args)),
    x: $props.iconFontSize,
    y: $props.height,
    z: $props.iconWidth
  } : {}, {
    A: common_vendor.n($props.customClass),
    B: $props.height,
    C: $props.borderRadius
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c34f888c"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/Grace6/components/gui-search.vue"]]);
wx.createComponent(Component);
