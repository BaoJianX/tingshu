"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_utils = require("../../utils/utils.js");
const stores_player = require("../../stores/player.js");
require("../../utils/constant.js");
require("../../config/confjg.js");
if (!Array) {
  const _easycom_gui_flex2 = common_vendor.resolveComponent("gui-flex");
  _easycom_gui_flex2();
}
const _easycom_gui_flex = () => "../../Grace6/components/gui-flex.js";
if (!Math) {
  _easycom_gui_flex();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "BottomNav",
  setup(__props) {
    const playerStore = stores_player.usePlayerStore();
    const pages = utils_utils.getCurrentPageInfo();
    const currentIndex = common_vendor.ref(0);
    const navListInfo = common_vendor.ref([
      {
        index: 0,
        path: "/pages/index/index"
      },
      {
        index: 1,
        path: "/pages/live/live"
      },
      {
        index: 2,
        path: `/pages/player/player`
      },
      {
        index: 3,
        path: "/pages/rank/rank"
      },
      {
        index: 4,
        path: "/pages/my/my"
      }
    ]);
    const navChange = (index) => {
      currentIndex.value = index;
      common_vendor.index.navigateTo({
        url: navListInfo.value[index].path
      });
    };
    common_vendor.onMounted(() => {
      var _a, _b;
      console.log("navListInfo.value.find((item) => item.path == pages.route)?.index || 0", ((_a = navListInfo.value.find((item) => item.path == pages.route)) == null ? void 0 : _a.index) || 0);
      currentIndex.value = ((_b = navListInfo.value.find((item) => item.path == pages.route)) == null ? void 0 : _b.index) || 0;
    });
    common_vendor.onShow(() => {
      var _a, _b;
      console.log("navListInfo.value.find((item) => item.path == pages.route)?.index || 0", ((_a = navListInfo.value.find((item) => item.path == pages.route)) == null ? void 0 : _a.index) || 0);
      currentIndex.value = ((_b = navListInfo.value.find((item) => item.path == pages.route)) == null ? void 0 : _b.index) || 0;
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.n(currentIndex.value == 0 ? "gui-primary-color" : "gui-color-gray"),
        b: common_vendor.n(currentIndex.value == 0 ? "gui-primary-color" : "gui-color-gray"),
        c: common_vendor.o(($event) => navChange(0)),
        d: common_vendor.n(currentIndex.value == 1 ? "gui-primary-color" : "gui-color-gray"),
        e: common_vendor.n(currentIndex.value == 1 ? "gui-primary-color" : "gui-color-gray"),
        f: common_vendor.o(($event) => navChange(1)),
        g: common_vendor.n(currentIndex.value == 3 ? "gui-primary-color" : "gui-color-gray"),
        h: common_vendor.n(currentIndex.value == 3 ? "gui-primary-color" : "gui-color-gray"),
        i: common_vendor.o(($event) => navChange(3)),
        j: common_vendor.n(currentIndex.value == 4 ? "gui-primary-color" : "gui-color-gray"),
        k: common_vendor.n(currentIndex.value == 4 ? "gui-primary-color" : "gui-color-gray"),
        l: common_vendor.o(($event) => navChange(4)),
        m: common_vendor.p({
          customClass: ["gui-footer"],
          direction: "row",
          wrap: false,
          alignItems: "center"
        }),
        n: common_vendor.n(currentIndex.value == 2 ? "gui-primary-color" : "gui-color-gray"),
        o: common_vendor.n(common_vendor.unref(playerStore).playing ? "playing" : ""),
        p: common_vendor.n(currentIndex.value == 2 ? "gui-primary-color" : "gui-color-gray"),
        q: common_vendor.o(($event) => navChange(2))
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a73deb8d"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/components/BottomNav/BottomNav.vue"]]);
wx.createComponent(Component);
