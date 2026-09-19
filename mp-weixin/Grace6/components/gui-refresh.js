"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "gui-refresh",
  props: {
    refreshText: { type: Array, default: function() {
      return ["继续下拉刷新", "松开手指开始刷新", "数据刷新中", "数据已刷新"];
    } },
    customClass: { type: Array, default: function() {
      return [
        ["gui-color-gray"],
        ["gui-color-gray"],
        ["gui-primary-text"],
        ["gui-color-green"]
      ];
    } },
    refreshFontSize: { type: Number, default: 28 },
    triggerHeight: { type: Number, default: 50 }
  },
  data() {
    return {
      reScrollTop: 0,
      refreshHeight: 0,
      refreshY: 0,
      refreshStatus: 0,
      refreshTimer: 0
    };
  },
  methods: {
    touchstart: function(e) {
      if (this.reScrollTop > 10) {
        return;
      }
      this.refreshY = e.changedTouches[0].pageY;
    },
    touchmove: function(e) {
      if (this.refreshStatus >= 1) {
        return null;
      }
      if (this.reScrollTop > 10) {
        return;
      }
      var moveY = e.changedTouches[0].pageY - this.refreshY;
      moveY = moveY / 2;
      if (moveY >= this.triggerHeight) {
        moveY = this.triggerHeight;
        this.refreshStatus = 1;
      }
      if (moveY > 15) {
        this.refreshHeight = moveY;
      }
    },
    touchend: function(e) {
      if (this.reScrollTop > 10) {
        return;
      }
      if (this.refreshStatus < 1) {
        return this.resetFresh();
      } else if (this.refreshStatus == 1) {
        this.refreshStatus = 2;
        this.$emit("reload");
      }
    },
    scroll: function(e) {
      this.reScrollTop = e.detail.scrollTop;
    },
    endReload: function() {
      this.refreshStatus = 3;
      setTimeout(() => {
        this.resetFresh();
      }, 1e3);
    },
    resetFresh: function() {
      this.refreshHeight = 0;
      this.refreshStatus = 0;
      return null;
    },
    rotate360: function() {
      var el = this.$refs.loadingIcon;
      animation.transition(el, {
        styles: {
          transform: "rotate(7200deg)",
          transformOrigin: "center"
        },
        duration: 2e4,
        timingFunction: "linear",
        needLayout: false,
        delay: 0
      });
    }
  },
  emits: ["reload"]
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.refreshStatus == 0 || $data.refreshStatus == 1
  }, $data.refreshStatus == 0 || $data.refreshStatus == 1 ? {
    b: common_vendor.n($props.customClass[$data.refreshStatus]),
    c: $props.refreshFontSize + "rpx",
    d: $props.refreshFontSize + "rpx",
    e: $props.refreshFontSize + "rpx",
    f: $props.refreshFontSize + "rpx"
  } : {}, {
    g: $data.refreshStatus == 2
  }, $data.refreshStatus == 2 ? {
    h: common_vendor.n($props.customClass[$data.refreshStatus]),
    i: $props.refreshFontSize + "rpx",
    j: $props.refreshFontSize + "rpx",
    k: $props.refreshFontSize + "rpx",
    l: $props.refreshFontSize + "rpx"
  } : {}, {
    m: $data.refreshStatus == 3
  }, $data.refreshStatus == 3 ? {
    n: common_vendor.n($props.customClass[$data.refreshStatus]),
    o: $props.refreshFontSize + "rpx",
    p: $props.refreshFontSize + "rpx",
    q: $props.refreshFontSize + "rpx",
    r: $props.refreshFontSize + "rpx"
  } : {}, {
    s: common_vendor.t($props.refreshText[$data.refreshStatus]),
    t: common_vendor.n($props.customClass[$data.refreshStatus]),
    v: $props.refreshFontSize + "rpx",
    w: $props.refreshFontSize + "rpx",
    x: $data.refreshHeight + "px"
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-adbb42b5"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/Grace6/components/gui-refresh.vue"]]);
wx.createComponent(Component);
