"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {};
  }
};
if (!Array) {
  const _easycom_gui_page2 = common_vendor.resolveComponent("gui-page");
  _easycom_gui_page2();
}
const _easycom_gui_page = () => "../../Grace6/components/gui-page.js";
if (!Math) {
  _easycom_gui_page();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f(4, (item, index, i0) => {
      return {
        a: item
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/pages/vipChannel/vipChannel.vue"]]);
wx.createPage(MiniProgramPage);
