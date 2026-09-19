"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "gui-swiper",
  props: {
    width: { type: Number, default: 750 },
    height: { type: Number, default: 300 },
    swiperItems: {
      type: Array,
      default: function() {
        return new Array();
      }
    },
    borderRadius: { type: String, default: "10rpx" },
    indicatorBarHeight: { type: Number, default: 68 },
    indicatorBarBgClass: {
      type: Array,
      default: function() {
        return ["gui-bg-black-opacity5"];
      }
    },
    indicatorWidth: { type: Number, default: 18 },
    indicatorActiveWidth: { type: Number, default: 18 },
    indicatorHeight: { type: Number, default: 18 },
    indicatorRadius: { type: Number, default: 18 },
    indicatorClass: {
      type: Array,
      default: function() {
        return ["gui-bg-gray", "gui-dark-bg-level-5"];
      }
    },
    indicatorActiveClass: {
      type: Array,
      default: function() {
        return ["gui-bg-primary"];
      }
    },
    indicatorType: { type: String, default: "dot" },
    indicatorPosition: { type: String, default: "absolute" },
    indicatorDirection: { type: String, default: "center" },
    spacing: { type: Number, default: 50 },
    padding: { type: Number, default: 26 },
    interval: { type: Number, default: 5e3 },
    autoplay: { type: Boolean, default: true },
    currentIndex: { type: Number, default: 0 },
    opacity: { type: Number, default: 0.66 },
    titleColor: { type: String, default: "#FFFFFF" },
    titleSize: { type: String, default: "28rpx" },
    imgMode: { type: String, default: "aspectFill" }
  },
  data() {
    return {
      current: 0,
      isReady: false,
      widthIn: 750,
      heightIn: 300,
      widthInSamll: 700,
      heightInSmall: 280,
      paddingY: 0
    };
  },
  watch: {
    currentIndex: function(val) {
      this.current = val;
    }
  },
  created: function() {
    this.current = this.currentIndex;
    this.init();
  },
  methods: {
    init: function() {
      this.widthIn = this.width - this.spacing * 2;
      this.heightIn = this.height / this.width * this.widthIn;
      this.paddingY = this.padding * this.height / this.width;
      this.widthInSamll = this.widthIn - this.padding * 2;
      this.heightInSmall = this.heightIn - this.paddingY * 2;
    },
    swiperchange: function(e) {
      var current = e.detail.current;
      this.current = current;
      this.$emit("swiperchange", current);
    },
    taped: function(e) {
      this.$emit("taped", e.currentTarget.dataset.index);
    }
  },
  emits: ["swiperchange", "taped"]
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($props.swiperItems, (item, index, i0) => {
      return common_vendor.e({
        a: item.opentype != "click"
      }, item.opentype != "click" ? {
        b: $props.borderRadius,
        c: $data.current != index ? $data.widthInSamll + "rpx" : $data.widthIn + "rpx",
        d: $data.current != index ? $data.heightInSmall + "rpx" : $data.heightIn + "rpx",
        e: $data.current != index ? $props.opacity : 1,
        f: item.img,
        g: $props.imgMode,
        h: item.url,
        i: item.opentype,
        j: $data.current != index ? $props.padding + "rpx" : "0rpx",
        k: $data.current != index ? $props.padding + "rpx" : "0rpx",
        l: $data.current != index ? $data.paddingY + "rpx" : "0rpx",
        m: $data.current != index ? $data.paddingY + "rpx" : "0rpx"
      } : {}, {
        n: item.opentype == "click"
      }, item.opentype == "click" ? {
        o: $props.borderRadius,
        p: $data.current != index ? $data.widthInSamll + "rpx" : $data.widthIn + "rpx",
        q: $data.current != index ? $data.heightInSmall + "rpx" : $data.heightIn + "rpx",
        r: $data.current != index ? $props.opacity : 1,
        s: item.img,
        t: $props.imgMode,
        v: common_vendor.o((...args) => $options.taped && $options.taped(...args), index),
        w: index,
        x: $data.current != index ? $props.padding + "rpx" : "0rpx",
        y: $data.current != index ? $props.padding + "rpx" : "0rpx",
        z: $data.current != index ? $data.paddingY + "rpx" : "0rpx",
        A: $data.current != index ? $data.paddingY + "rpx" : "0rpx"
      } : {}, $props.indicatorType == "number" ? {
        B: common_vendor.t(index + 1),
        C: $props.titleColor,
        D: $props.titleColor,
        E: common_vendor.t($props.swiperItems.length),
        F: $props.titleColor,
        G: common_vendor.t(item.title),
        H: $props.titleColor,
        I: $props.titleSize,
        J: $props.indicatorBarHeight + "rpx",
        K: $props.indicatorBarHeight + "rpx",
        L: common_vendor.n($props.indicatorBarBgClass),
        M: $props.indicatorBarHeight + "rpx",
        N: $props.borderRadius,
        O: $props.borderRadius,
        P: $data.current != index ? $data.widthInSamll + "rpx" : $data.widthIn + "rpx",
        Q: $data.current != index ? $props.padding + "rpx" : "0rpx",
        R: $data.current != index ? $data.paddingY + "rpx" : "0rpx"
      } : {}, {
        S: index
      });
    }),
    b: $props.indicatorType == "number",
    c: $props.width + "rpx",
    d: $data.heightIn + "rpx",
    e: $props.interval,
    f: $props.autoplay,
    g: $props.currentIndex,
    h: $props.spacing + "rpx",
    i: $props.spacing + "rpx",
    j: common_vendor.o((...args) => $options.swiperchange && $options.swiperchange(...args)),
    k: $props.indicatorType == "dot"
  }, $props.indicatorType == "dot" ? {
    l: common_vendor.f($props.swiperItems, (item, index, i0) => {
      return {
        a: index,
        b: common_vendor.n($data.current == index ? "dot-show" : ""),
        c: common_vendor.n($data.current == index ? $props.indicatorActiveClass : $props.indicatorClass),
        d: $data.current != index ? $props.indicatorWidth + "rpx" : $props.indicatorActiveWidth + "rpx"
      };
    }),
    m: $props.indicatorHeight + "rpx",
    n: $props.indicatorRadius + "rpx",
    o: $props.width + "rpx",
    p: $props.indicatorBarHeight + "rpx",
    q: $props.indicatorPosition,
    r: $props.spacing + "rpx",
    s: $props.spacing + "rpx",
    t: $props.indicatorDirection
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-97684a3b"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/Grace6/components/gui-swiper.vue"]]);
wx.createComponent(Component);
