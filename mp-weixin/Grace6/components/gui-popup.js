"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "gui-popup",
  props: {
    bgColor: { type: String, default: "rgba(0, 0, 0, 0.7)" },
    position: { type: String, default: "center" },
    width: { type: String, default: "580rpx" },
    canCloseByShade: { type: Boolean, default: true },
    zIndex: { type: Number, default: 999 },
    top: { type: Number, default: 0 },
    duration: { type: Number, default: 280 },
    isSwitchPage: { type: Boolean, default: false }
  },
  data() {
    return {
      show: false,
      out: false
    };
  },
  methods: {
    open: function() {
      this.out = false;
      this.show = true;
      this.$emit("open");
    },
    closebysd: function() {
      if (this.canCloseByShade) {
        this.close();
      }
    },
    close: function() {
      this.out = true;
      setTimeout(() => {
        this.show = false;
        this.$emit("close");
      }, 350);
    },
    stopfun: function(e) {
      e.stopPropagation();
      return null;
    }
  },
  emits: ["close", "open"]
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.show
  }, $data.show ? common_vendor.e({
    b: $props.position == "center"
  }, $props.position == "center" ? {
    c: common_vendor.o((...args) => $options.stopfun && $options.stopfun(...args)),
    d: common_vendor.n($data.out ? "gui-scale-out" : "gui-scale-in"),
    e: $props.width,
    f: $props.duration + "ms",
    g: common_vendor.n($data.out ? "gui-fade-out" : "gui-fade-in"),
    h: common_vendor.o((...args) => $options.closebysd && $options.closebysd(...args)),
    i: common_vendor.o((...args) => $options.stopfun && $options.stopfun(...args)),
    j: $props.bgColor,
    k: $props.zIndex,
    l: $props.top + "px",
    m: $props.duration + "ms"
  } : {}, {
    n: $props.position == "top"
  }, $props.position == "top" ? {
    o: common_vendor.o((...args) => $options.stopfun && $options.stopfun(...args)),
    p: common_vendor.n($data.out ? "gui-top-out" : "gui-top-in"),
    q: $props.duration + "ms",
    r: $props.bgColor,
    s: $props.zIndex,
    t: $props.top + "px",
    v: $props.duration + "ms",
    w: common_vendor.n($data.out ? "gui-fade-out" : "gui-fade-in"),
    x: common_vendor.o((...args) => $options.closebysd && $options.closebysd(...args)),
    y: common_vendor.o((...args) => $options.stopfun && $options.stopfun(...args))
  } : {}, {
    z: $props.position == "bottom"
  }, $props.position == "bottom" ? {
    A: common_vendor.o((...args) => $options.stopfun && $options.stopfun(...args)),
    B: common_vendor.n($data.out ? "gui-bottom-out" : "gui-bottom-in"),
    C: $props.duration + "ms",
    D: $props.bgColor,
    E: $props.zIndex,
    F: $props.top + "px",
    G: $props.duration + "ms",
    H: common_vendor.n($data.out ? "gui-fade-out" : "gui-fade-in"),
    I: common_vendor.o((...args) => $options.closebysd && $options.closebysd(...args)),
    J: common_vendor.o((...args) => $options.stopfun && $options.stopfun(...args))
  } : {}, {
    K: $props.position == "left"
  }, $props.position == "left" ? {
    L: common_vendor.o((...args) => $options.stopfun && $options.stopfun(...args)),
    M: common_vendor.n($data.out ? "gui-left-out" : "gui-left-in"),
    N: $props.width,
    O: $props.duration + "ms",
    P: common_vendor.n($data.out ? "gui-fade-out" : "gui-fade-in"),
    Q: common_vendor.o((...args) => $options.closebysd && $options.closebysd(...args)),
    R: common_vendor.o((...args) => $options.stopfun && $options.stopfun(...args)),
    S: $props.bgColor,
    T: $props.zIndex,
    U: $props.top + "px",
    V: $props.duration + "ms"
  } : {}, {
    W: $props.position == "right"
  }, $props.position == "right" ? {
    X: common_vendor.o((...args) => $options.stopfun && $options.stopfun(...args)),
    Y: common_vendor.n($data.out ? "gui-right-out" : "gui-right-in"),
    Z: $props.width,
    aa: $props.duration + "ms",
    ab: common_vendor.n($data.out ? "gui-fade-out" : "gui-fade-in"),
    ac: common_vendor.o((...args) => $options.closebysd && $options.closebysd(...args)),
    ad: common_vendor.o((...args) => $options.stopfun && $options.stopfun(...args)),
    ae: $props.bgColor,
    af: $props.zIndex,
    ag: $props.top + "px",
    ah: $props.duration + "ms"
  } : {}) : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c6cddaae"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/Grace6/components/gui-popup.vue"]]);
wx.createComponent(Component);
