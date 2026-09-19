"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_gui_header_leading2 = common_vendor.resolveComponent("gui-header-leading");
  const _easycom_gui_article_info2 = common_vendor.resolveComponent("gui-article-info");
  const _easycom_gui_spread2 = common_vendor.resolveComponent("gui-spread");
  const _easycom_gui_iphone_bottom2 = common_vendor.resolveComponent("gui-iphone-bottom");
  const _easycom_gui_page2 = common_vendor.resolveComponent("gui-page");
  (_easycom_gui_header_leading2 + _easycom_gui_article_info2 + _easycom_gui_spread2 + _easycom_gui_iphone_bottom2 + _easycom_gui_page2)();
}
const _easycom_gui_header_leading = () => "../../Grace6/components/gui-header-leading.js";
const _easycom_gui_article_info = () => "../../Grace6/components/gui-article-info.js";
const _easycom_gui_spread = () => "../../Grace6/components/gui-spread.js";
const _easycom_gui_iphone_bottom = () => "../../Grace6/components/gui-iphone-bottom.js";
const _easycom_gui_page = () => "../../Grace6/components/gui-page.js";
if (!Math) {
  (_easycom_gui_header_leading + _easycom_gui_article_info + _easycom_gui_spread + _easycom_gui_iphone_bottom + _easycom_gui_page)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "album",
  setup(__props) {
    const article = common_vendor.ref([]);
    common_vendor.index.request({
      url: "https://www.graceui.com/api/html2array",
      success: (res) => {
        article.value = res.data.data;
      }
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(_ctx.goHome),
        b: common_vendor.p({
          back: false
        }),
        c: common_vendor.p({
          article: article.value
        }),
        d: common_vendor.p({
          width: "750rpx",
          height: "600rpx",
          isShrink: true
        }),
        e: common_vendor.f(30, (n, k0, i0) => {
          return {
            a: n
          };
        }),
        f: common_vendor.p({
          customHeader: true,
          customFooter: true
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/pages/album/album.vue"]]);
wx.createPage(MiniProgramPage);
