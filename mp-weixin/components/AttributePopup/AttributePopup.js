"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_data_checkbox2 = common_vendor.resolveComponent("uni-data-checkbox");
  const _easycom_gui_popup2 = common_vendor.resolveComponent("gui-popup");
  (_easycom_uni_data_checkbox2 + _easycom_gui_popup2)();
}
const _easycom_uni_data_checkbox = () => "../../uni_modules/uni-data-checkbox/components/uni-data-checkbox/uni-data-checkbox.js";
const _easycom_gui_popup = () => "../../Grace6/components/gui-popup.js";
if (!Math) {
  (_easycom_uni_data_checkbox + _easycom_gui_popup)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "AttributePopup",
  props: {
    attributeList: {
      type: Array,
      default: () => []
    }
  },
  setup(__props, { expose }) {
    const props = __props;
    const popup = common_vendor.ref();
    const attrChange = (e, index) => {
    };
    const openPopup = () => {
      console.log(popup.value);
      popup.value && popup.value.open();
    };
    const closePopup = () => {
      popup.value && popup.value.close();
    };
    expose({ openPopup, closePopup });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(closePopup),
        b: common_vendor.f(props.attributeList, (item, index, i0) => {
          return {
            a: common_vendor.t(item.attributeName),
            b: common_vendor.o((e) => attrChange(), index),
            c: "486ead6e-1-" + i0 + ",486ead6e-0",
            d: common_vendor.o(($event) => item.checkedId = $event, index),
            e: common_vendor.p({
              mode: "tag",
              localdata: item.attributeValueList,
              modelValue: item.checkedId
            }),
            f: index
          };
        }),
        c: common_vendor.sr(popup, "486ead6e-0", {
          "k": "popup"
        }),
        d: common_vendor.p({
          position: "bottom"
        })
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-486ead6e"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/components/AttributePopup/AttributePopup.vue"]]);
wx.createComponent(Component);
