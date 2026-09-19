"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const hooks_useUpdateUserInfo = require("./hooks/useUpdateUserInfo.js");
require("./utils/mitt.js");
const Grace6_js_request = require("./Grace6/js/request.js");
require("./stores/user.js");
require("./utils/constant.js");
require("./config/confjg.js");
require("./utils/utils.js");
require("./api/user/user.js");
require("./utils/request.js");
require("./api/order/order.js");
require("./custom/graceRequestConfig.js");
require("./Grace6/js/md5.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/live/live.js";
  "./pages/livePush/livePush.js";
  "./pages/livePlay/livePlay.js";
  "./pages/creatLivePush/creatLivePush.js";
  "./pages/player/player.js";
  "./pages/rank/rank.js";
  "./pages/my/my.js";
  "./pages/updateInfo/updateInfo.js";
  "./pages/album/album.js";
  "./pages/detail/detail.js";
  "./pages/confirmOrder/confirmOrder.js";
  "./pages/works/works.js";
  "./pages/categories/categories.js";
  "./pages/wallet/wallet.js";
  "./pages/fund/fund.js";
  "./pages/orderDetail/orderDetail.js";
  "./pages/order/order.js";
  "./pages/createAlbum/createAlbum.js";
  "./pages/createTrack/createTrack.js";
  "./pages/vipChannel/vipChannel.js";
  "./pages/myWork/myWork.js";
  "./pages/demo/demo.js";
  "./pages/search/search.js";
  "./pages/login/login.js";
  "./pages/paySuccess/paySuccess.js";
  "./pages/setting/setting.js";
}
const _sfc_main = {
  onLaunch: function() {
  },
  onShow: function() {
  },
  onHide: function() {
  }
};
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/App.vue"]]);
const pinia = common_vendor.createPinia();
pinia.use(common_vendor.index$1);
common_vendor.index.gRequest = Grace6_js_request.GraceRequest;
function createApp() {
  const app = common_vendor.createSSRApp(App);
  app.use(pinia);
  let { updateUserInfo } = hooks_useUpdateUserInfo.useUpdateUserInfo();
  updateUserInfo();
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
