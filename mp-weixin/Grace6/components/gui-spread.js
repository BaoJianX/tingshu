"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "gui-spread",
  props: {
    width: { type: String, default: "690rpx" },
    height: { type: String, default: "600rpx" },
    btnTxt: { type: String, default: "展开阅读全文" },
    btnTxtSize: { type: String, default: "28rpx" },
    zIndex: { type: Number, default: 1 },
    isShrink: { type: Boolean, default: false },
    shrinkBtnTxt: { type: String, default: "收缩文章" }
  },
  data() {
    return {
      reHeight: "600px",
      isBtn: true
    };
  },
  created: function() {
    this.reHeight = this.height;
  },
  methods: {
    spreadContent: function() {
      this.reHeight = "auto";
      this.isBtn = false;
    },
    shrinkContent: function() {
      this.reHeight = this.height;
      this.isBtn = true;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$data.isBtn && $props.isShrink ? "80rpx" : "0rpx",
    b: $data.isBtn
  }, $data.isBtn ? {
    c: common_vendor.t($props.btnTxt),
    d: common_vendor.o((...args) => $options.spreadContent && $options.spreadContent(...args)),
    e: $props.btnTxtSize,
    f: $props.zIndex,
    g: $props.width
  } : {}, {
    h: !$data.isBtn && $props.isShrink
  }, !$data.isBtn && $props.isShrink ? {
    i: common_vendor.t($props.shrinkBtnTxt),
    j: common_vendor.o((...args) => $options.shrinkContent && $options.shrinkContent(...args)),
    k: $props.btnTxtSize,
    l: $props.zIndex,
    m: $props.width
  } : {}, {
    n: common_vendor.n($props.isShrink ? "gui-transition-all" : ""),
    o: $data.reHeight
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-556ee095"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/Grace6/components/gui-spread.vue"]]);
wx.createComponent(Component);
