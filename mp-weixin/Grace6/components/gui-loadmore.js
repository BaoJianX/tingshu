"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "gui-loadmore",
  props: {
    loadMoreText: { type: Array, default: function() {
      return ["", "数据加载中", "已加载全部数据", "暂无数据"];
    } },
    customClass: { type: Array, default: function() {
      return ["gui-color-gray"];
    } },
    loadMoreFontSize: { type: String, default: "26rpx" },
    status: { type: Number, default: 0 }
  },
  data() {
    return {
      loadMoreStatus: 0,
      hidden: false
    };
  },
  created: function() {
    this.loadMoreStatus = this.status;
    if (this.status == 1)
      ;
  },
  methods: {
    loading: function() {
      this.loadMoreStatus = 1;
    },
    stoploadmore: function() {
      this.loadMoreStatus = 0;
    },
    stopLoadmore: function() {
      this.loadMoreStatus = 0;
    },
    nomore: function() {
      this.loadMoreStatus = 2;
    },
    empty: function() {
      this.loadMoreStatus = 3;
    },
    hide: function() {
      this.hidden = true;
    },
    rotate360: function() {
      var el = this.$refs.loadingiconforloadmore;
      animation.transition(el, {
        styles: { transform: "rotate(7200deg)" },
        duration: 2e4,
        timingFunction: "linear",
        needLayout: false,
        delay: 0
      });
    },
    tapme: function() {
      if (this.loadMoreStatus == 0) {
        this.$emit("tapme");
      }
    }
  },
  emits: ["tapme"]
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.loadMoreStatus == 0
  }, $data.loadMoreStatus == 0 ? {
    b: $props.loadMoreFontSize
  } : {}, {
    c: $data.loadMoreStatus == 1
  }, $data.loadMoreStatus == 1 ? {
    d: common_vendor.n($props.customClass),
    e: $props.loadMoreFontSize
  } : {}, {
    f: common_vendor.t($props.loadMoreText[$data.loadMoreStatus]),
    g: common_vendor.n($props.customClass),
    h: $props.loadMoreFontSize,
    i: common_vendor.o((...args) => $options.tapme && $options.tapme(...args))
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7ad38fb8"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/Grace6/components/gui-loadmore.vue"]]);
wx.createComponent(Component);
