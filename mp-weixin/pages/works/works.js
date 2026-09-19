"use strict";
const common_vendor = require("../../common/vendor.js");
const Grace6_js_grace = require("../../Grace6/js/grace.js");
require("../../Grace6/js/md5.js");
const _sfc_main = {
  data() {
    return {
      mainHeight: 300
    };
  },
  onLoad: function() {
    var systemInfo = Grace6_js_grace.graceJS.system();
    this.mainHeight = systemInfo.windowHeight - common_vendor.index.upx2px(500);
  },
  methods: {
    goHome: function() {
      common_vendor.index.redirectTo({
        url: "/pages/index/index"
      });
    }
  }
};
if (!Array) {
  const _easycom_gui_header_leading2 = common_vendor.resolveComponent("gui-header-leading");
  const _easycom_gui_switch_navigation2 = common_vendor.resolveComponent("gui-switch-navigation");
  const _easycom_gui_select_menu2 = common_vendor.resolveComponent("gui-select-menu");
  const _easycom_gui_page2 = common_vendor.resolveComponent("gui-page");
  (_easycom_gui_header_leading2 + _easycom_gui_switch_navigation2 + _easycom_gui_select_menu2 + _easycom_gui_page2)();
}
const _easycom_gui_header_leading = () => "../../Grace6/components/gui-header-leading.js";
const _easycom_gui_switch_navigation = () => "../../Grace6/components/gui-switch-navigation.js";
const _easycom_gui_select_menu = () => "../../Grace6/components/gui-select-menu.js";
const _easycom_gui_page = () => "../../Grace6/components/gui-page.js";
if (!Math) {
  (_easycom_gui_header_leading + _easycom_gui_switch_navigation + _easycom_gui_select_menu + _easycom_gui_page)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o($options.goHome),
    b: common_vendor.p({
      items: [{
        id: 0,
        name: "专辑",
        tips: "8"
      }, {
        id: 1,
        name: "声音"
      }],
      size: 0,
      margin: 20,
      padding: "30rpx",
      activeLineHeight: "4rpx"
    }),
    c: common_vendor.sr("selectMenu3", "2475a018-3,2475a018-0"),
    d: common_vendor.o(_ctx.select4),
    e: common_vendor.p({
      items: ["全部分类", "精选优品", "价格较低", "只买贵的", "其他方式"],
      isInput: true,
      inputType: "search"
    }),
    f: common_vendor.f(20, (index, k0, i0) => {
      return {
        a: index
      };
    }),
    g: $data.mainHeight + "px",
    h: common_vendor.p({
      customHeader: true
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-2475a018"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/pages/works/works.vue"]]);
wx.createPage(MiniProgramPage);
