"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../stores/user.js");
const api_live_live = require("../../api/live/live.js");
require("../../utils/constant.js");
require("../../config/confjg.js");
require("../../utils/utils.js");
require("../../api/user/user.js");
require("../../utils/request.js");
require("../../api/order/order.js");
if (!Array) {
  const _easycom_gui_image2 = common_vendor.resolveComponent("gui-image");
  const _easycom_BottomNav2 = common_vendor.resolveComponent("BottomNav");
  const _easycom_gui_page2 = common_vendor.resolveComponent("gui-page");
  (_easycom_gui_image2 + _easycom_BottomNav2 + _easycom_gui_page2)();
}
const _easycom_gui_image = () => "../../Grace6/components/gui-image.js";
const _easycom_BottomNav = () => "../../components/BottomNav/BottomNav.js";
const _easycom_gui_page = () => "../../Grace6/components/gui-page.js";
if (!Math) {
  (_easycom_gui_image + _easycom_BottomNav + _easycom_gui_page)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "live",
  setup(__props) {
    const liveList = common_vendor.ref([]);
    const liveTagList = common_vendor.ref([]);
    const getLiveList = async () => {
      try {
        const res = await api_live_live.liveService.getLiveList();
        console.log("res", res);
        liveList.value = res.data;
      } catch (error) {
        console.log(error);
      }
    };
    const getLiveTagList = async () => {
      try {
        const res = await api_live_live.liveService.getLiveTagList();
        liveTagList.value = res.data;
      } catch (error) {
        console.log(error);
      }
    };
    const getLiveTag = (id) => {
      const tag = liveTagList.value.find((item) => +item.id === +id);
      return tag ? tag.name : "";
    };
    const goToLivePlay = (item) => {
      console.log("item", item);
      common_vendor.index.navigateTo({
        url: `/pages/livePlay/livePlay?id=${item.id}`
      });
    };
    common_vendor.onMounted(() => {
      getLiveList();
      getLiveTagList();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(liveTagList.value, (liveTagItem, k0, i0) => {
          return common_vendor.e({
            a: liveList.value.filter((liveItem) => +liveItem.tagId === +liveTagItem.id).length
          }, liveList.value.filter((liveItem) => +liveItem.tagId === +liveTagItem.id).length ? {
            b: common_vendor.t(liveTagItem.name),
            c: common_vendor.f(liveList.value.filter((liveItem) => +liveItem.tagId === +liveTagItem.id), (item, index, i1) => {
              return {
                a: common_vendor.t(getLiveTag(item.tagId)),
                b: common_vendor.t(item.viewCount),
                c: "4934862e-1-" + i0 + "-" + i1 + ",4934862e-0",
                d: common_vendor.p({
                  src: item.coverUrl,
                  width: 220,
                  height: 220
                }),
                e: common_vendor.t(item.liveTitle),
                f: index,
                g: common_vendor.o(($event) => goToLivePlay(item), index)
              };
            })
          } : {}, {
            d: liveTagItem.id
          });
        }),
        b: common_vendor.p({
          headerClass: ["gui-bg-white"],
          customFooter: true
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4934862e"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/pages/live/live.vue"]]);
wx.createPage(MiniProgramPage);
