"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../stores/user.js");
const api_order_order = require("../../api/order/order.js");
require("../../utils/constant.js");
require("../../config/confjg.js");
require("../../utils/utils.js");
require("../../api/user/user.js");
require("../../utils/request.js");
if (!Array) {
  const _easycom_gui_switch_navigation2 = common_vendor.resolveComponent("gui-switch-navigation");
  _easycom_gui_switch_navigation2();
}
const _easycom_gui_switch_navigation = () => "../../Grace6/components/gui-switch-navigation.js";
if (!Math) {
  (_easycom_gui_switch_navigation + ZPaging)();
}
const ZPaging = () => "../../uni_modules/z-paging/components/z-paging/z-paging.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "fund",
  props: {
    id: {
      type: String,
      default: "invest"
    }
  },
  setup(__props) {
    const props = __props;
    const zPagingRef = common_vendor.ref();
    const navItems = common_vendor.ref([
      { name: "充值记录", id: "invest" },
      { name: "消费记录", id: "consume" }
    ]);
    const pageData = common_vendor.reactive({
      currentPageNav: "invest",
      currentIndex: 0,
      // 控制索引显示
      // 充值记录
      invest: {
        // 列表
        list: []
      },
      // 消费记录
      consume: {
        // 列表
        list: []
      }
    });
    const navChange = (index, navItemId) => {
      pageData.currentPageNav = navItemId;
      pageData.currentIndex = index;
      zPagingRef.value.reload();
      console.log("navChange", index, navItemId);
    };
    const getListInfo = async (page, limit) => {
      const params = {
        page,
        limit
      };
      try {
        if (pageData.currentPageNav === "invest") {
          const res = await api_order_order.order.getInvestRecordList(params);
          zPagingRef.value.complete(res.data.records);
        } else if (pageData.currentPageNav === "consume") {
          const res = await api_order_order.order.getConsumeRecordList(params);
          zPagingRef.value.complete(res.data.records);
        }
      } catch (error) {
        console.log(error);
        zPagingRef.value.complete(false);
      }
    };
    common_vendor.onMounted(() => {
      if (props.id === "invest") {
        pageData.currentPageNav = "invest";
        pageData.currentIndex = 0;
      } else if (props.id === "consume") {
        pageData.currentPageNav = "consume";
        pageData.currentIndex = 1;
      }
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o((index) => navChange(index, navItems.value[index].id)),
        b: common_vendor.p({
          textAlign: "center",
          isCenter: true,
          activeDirection: "center",
          size: 0,
          margin: 0,
          padding: "30rpx",
          activeLineHeight: "4rpx",
          activeLineWidth: "40rpx",
          currentIndex: pageData.currentIndex,
          items: navItems.value
        }),
        c: common_vendor.f(pageData[pageData.currentPageNav].list, (item, index, i0) => {
          return {
            a: common_vendor.t(item.title),
            b: common_vendor.t(item.createTime),
            c: common_vendor.t(pageData.currentPageNav === navItems.value[0].id ? `+${item.amount}` : `-${item.amount}`),
            d: item.id
          };
        }),
        d: common_vendor.sr(zPagingRef, "5c7ece6e-0", {
          "k": "zPagingRef"
        }),
        e: common_vendor.o(getListInfo),
        f: common_vendor.o(($event) => pageData[pageData.currentPageNav].list = $event),
        g: common_vendor.p({
          ["show-refresher-update-time"]: true,
          ["auto-show-back-to-top"]: true,
          modelValue: pageData[pageData.currentPageNav].list
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/pages/fund/fund.vue"]]);
wx.createPage(MiniProgramPage);
