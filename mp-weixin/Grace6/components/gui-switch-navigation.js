"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "gui-switch-navigation",
  props: {
    width: { type: Number, default: 690 },
    isCenter: { type: Boolean, default: false },
    currentIndex: { type: Number, default: 0 },
    size: { type: Number, default: 120 },
    fontSize: { type: String, default: "28rpx" },
    activeFontSize: { type: String, default: "28rpx" },
    items: { type: Array, default: function() {
      return [];
    } },
    activeLineClass: { type: Array, default: function() {
      return ["gui-nav-scale", "gui-gtbg-blue", "gui-gtbg-black"];
    } },
    titleClass: { type: Array, default: function() {
      return ["gui-primary-text"];
    } },
    titleActiveClass: { type: Array, default: function() {
      return ["gui-primary-text"];
    } },
    activeLineHeight: { type: String, default: "5rpx" },
    activeLineWidth: { type: String, default: "36rpx" },
    activeLineRadius: { type: String, default: "0rpx" },
    activeDirection: { type: String, default: "" },
    activeFontWeight: { type: Number, default: 700 },
    margin: { type: Number, default: 0 },
    textAlign: { type: String, default: "" },
    lineHeight: { type: String, default: "50rpx" },
    padding: { type: String, default: "0rpx" },
    animatie: { type: Boolean, default: true },
    scorllAnimation: { type: Boolean, default: true },
    tipsStyle: {
      type: String,
      default: "background-color:#FF0000; padding:0 10rpx; color:#FFFFFF; font-size:22rpx"
    }
  },
  data() {
    return {
      currentIndexIn: 0,
      itemsIn: [],
      random: 1,
      scrollLeft: 0,
      scrllTimer: null,
      autoLeft: ""
    };
  },
  created: function() {
    this.currentIndexIn = this.currentIndex;
    this.itemsIn = this.items;
    this.random = this.randomNum();
  },
  watch: {
    currentIndex: function(value) {
      this.currentIndexIn = value;
    },
    currentIndexIn: function(val) {
      if (this.scrllTimer != null) {
        clearTimeout(this.scrllTimer);
      }
      this.scrllTimer = setTimeout(() => {
        this.setLeft();
      }, 200);
    },
    items: function(value) {
      this.itemsIn = value;
    }
  },
  methods: {
    change: function(e) {
      this.currentIndexIn = e.currentTarget.dataset.index;
      this.$emit("change", Number(e.currentTarget.dataset.index));
    },
    randomNum: function() {
      return parseInt(Math.random() * 1e3);
    },
    setLeft: function() {
      if (this.size < 1) {
        this.autoLeft = "tab-" + this.currentIndexIn + this.random;
        return;
      }
      var itemWidth = Number(this.margin) + Number(this.size);
      var left = (Number(this.currentIndexIn) + 1) * itemWidth - Number(this.width) / 2 - itemWidth / 2;
      var maxLeft = Number(this.itemsIn.length) * itemWidth - this.width;
      maxLeft = common_vendor.index.upx2px(maxLeft - 30);
      left = common_vendor.index.upx2px(left);
      if (left > maxLeft) {
        left = maxLeft;
      }
      if (left < 0) {
        left = 0;
      }
      this.scrollLeft = left;
    }
  },
  emits: ["change"]
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.itemsIn, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.name),
        b: common_vendor.n(index == $data.currentIndexIn ? $props.titleActiveClass : []),
        c: $data.currentIndexIn == index ? $props.activeFontSize : $props.fontSize,
        d: $data.currentIndexIn == index ? $props.activeFontWeight : "",
        e: item.tips
      }, item.tips ? common_vendor.e({
        f: item.tips != "point"
      }, item.tips != "point" ? {
        g: common_vendor.t(item.tips),
        h: common_vendor.s($props.tipsStyle)
      } : {
        i: common_vendor.s($props.tipsStyle + "; width:12rpx; height:12rpx; over-flow:hidden; padding:0rpx; margin-top:10rpx;")
      }) : {}, {
        j: $data.currentIndexIn == index
      }, $data.currentIndexIn == index ? {
        k: common_vendor.n($data.currentIndexIn == index ? $props.activeLineClass : []),
        l: $props.activeLineWidth,
        m: $props.activeLineHeight,
        n: $props.activeLineRadius
      } : {}, {
        o: "tab-" + index + ($data.random + ""),
        p: index,
        q: common_vendor.o((...args) => $options.change && $options.change(...args), index),
        r: index
      });
    }),
    b: common_vendor.n($props.titleClass),
    c: $props.textAlign,
    d: $props.lineHeight,
    e: common_vendor.n($props.textAlign == "center" ? "gui-justify-content-center" : ""),
    f: $props.activeDirection,
    g: $props.size == 0 ? "auto" : $props.size + "rpx",
    h: $props.margin + "rpx",
    i: $props.padding,
    j: $props.padding,
    k: $props.scorllAnimation,
    l: common_vendor.n($props.isCenter ? "gui-nav-center" : ""),
    m: $props.width + "rpx",
    n: $data.autoLeft,
    o: $data.scrollLeft
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7f73495d"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/Grace6/components/gui-switch-navigation.vue"]]);
wx.createComponent(Component);
