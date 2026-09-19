"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "gui-link",
  props: {
    url: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    color: {
      type: String,
      default: "#008AFF"
    },
    fontSize: {
      type: String,
      default: "28rpx"
    },
    lineHeight: {
      type: String,
      default: "50rpx"
    }
  },
  methods: {
    openUrlForApp: function(e) {
      var link = e.currentTarget.dataset.url;
      plus.runtime.openURL(link);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($props.url),
    b: $props.color,
    c: $props.lineHeight,
    d: $props.fontSize
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/Grace6/components/gui-link.vue"]]);
wx.createComponent(Component);
