"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "gui-iphone-bottom",
  props: {
    height: { type: String, default: "60rpx" },
    isSwitchPage: { type: Boolean, default: false },
    customClass: { type: Array, default: function() {
      return ["gui-bg-transparent"];
    } }
  },
  data() {
    return {
      need: false
    };
  },
  created: function() {
    if (this.isSwitchPage) {
      return;
    }
    var system = common_vendor.index.getSystemInfoSync();
    if (system.model) {
      system.model = system.model.replace(" ", "");
      system.model = system.model.toLowerCase();
      var res1 = system.model.indexOf("iphonex");
      if (res1 > 5) {
        res1 = -1;
      }
      var res2 = system.model.indexOf("iphone1");
      if (res2 > 5) {
        res2 = -1;
      }
      if (res1 != -1 || res2 != -1) {
        this.need = true;
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.need
  }, $data.need ? {
    b: $props.height,
    c: common_vendor.n($props.customClass)
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/Grace6/components/gui-iphone-bottom.vue"]]);
wx.createComponent(Component);
