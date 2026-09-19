"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../stores/user.js");
require("../../utils/constant.js");
require("../../config/confjg.js");
require("../../utils/utils.js");
require("../../api/user/user.js");
require("../../utils/request.js");
require("../../api/order/order.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "livePush",
  props: {
    id: {
      type: String,
      required: true,
      default: ""
    }
  },
  setup(__props) {
    common_vendor.ref({});
    common_vendor.onMounted(async () => {
    });
    return (_ctx, _cache) => {
      return {};
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/pages/livePush/livePush.vue"]]);
wx.createPage(MiniProgramPage);
