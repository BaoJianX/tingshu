"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "gui-image",
  props: {
    src: { type: String, default: "" },
    width: { type: Number, default: 300 },
    height: { type: Number, default: 0 },
    timer: { type: Number, default: 200 },
    borderRadius: { type: String, default: "0rpx" },
    mode: { type: String, default: "widthFix" }
  },
  data() {
    return {
      isLoading: true,
      imgHeight: 180,
      opacity: 0,
      animate: false,
      failed: false
    };
  },
  methods: {
    imgLoad: function(e) {
      var scale = e.detail.width / e.detail.height;
      if (this.mode == "widthFix") {
        this.imgHeight = this.width / scale;
      } else {
        this.imgHeight = this.height;
      }
      this.animate = true;
      setTimeout(() => {
        this.isLoading = false;
        this.opacity = 1;
      }, this.timer);
    },
    error: function() {
      this.isLoading = false;
      this.failed = true;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.src,
    b: common_vendor.o((...args) => $options.imgLoad && $options.imgLoad(...args)),
    c: common_vendor.o((...args) => $options.error && $options.error(...args)),
    d: $props.mode,
    e: $props.width + "rpx",
    f: $data.imgHeight + "rpx",
    g: $props.borderRadius,
    h: $data.opacity,
    i: $data.isLoading
  }, $data.isLoading ? {
    j: common_vendor.n($data.animate ? "gui-fade-out" : ""),
    k: $props.width + "rpx",
    l: $props.height == 0 ? $data.imgHeight + "rpx" : $props.height + "rpx",
    m: $props.height == 0 ? $data.imgHeight + "rpx" : $props.height + "rpx",
    n: $props.borderRadius
  } : {}, {
    o: $data.failed
  }, $data.failed ? {
    p: common_vendor.n($data.animate ? "gui-fade-out" : ""),
    q: $props.width + "rpx",
    r: $props.height == 0 ? $data.imgHeight + "rpx" : $props.height + "rpx",
    s: $props.height == 0 ? $data.imgHeight + "rpx" : $props.height + "rpx",
    t: $props.borderRadius
  } : {}, {
    v: $props.width + "rpx",
    w: $props.height == 0 ? $data.imgHeight + "rpx" : $props.height + "rpx",
    x: $props.borderRadius
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-2a3c977b"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/Grace6/components/gui-image.vue"]]);
wx.createComponent(Component);
