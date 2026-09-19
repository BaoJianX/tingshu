"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_utils = require("../../utils/utils.js");
require("../../utils/constant.js");
require("../../config/confjg.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "Resizable",
  props: {
    minHeight: {
      type: Number,
      default: 100
    },
    maxHeight: {
      type: Number,
      default: 300
    },
    initialHeight: {
      type: Number,
      default: 200
    }
  },
  setup(__props, { expose }) {
    const props = __props;
    const startY = common_vendor.ref(0);
    const boxHeight = common_vendor.ref(props.initialHeight);
    const minHeight = common_vendor.ref(props.minHeight);
    const maxHeight = common_vendor.ref(props.maxHeight);
    function onTouchMove(e) {
      console.log("onTouchMove");
      if (startY.value === 0) {
        startY.value = e.changedTouches[0].clientY;
        return;
      }
      const diff = startY.value - e.changedTouches[0].clientY;
      boxHeight.value += diff;
      if (boxHeight.value < minHeight.value) {
        boxHeight.value = minHeight.value;
      } else if (boxHeight.value > maxHeight.value) {
        boxHeight.value = maxHeight.value;
      }
      startY.value = e.changedTouches[0].clientY;
    }
    const handleTouchMove = utils_utils.myThrottle(onTouchMove, 100);
    let timeoutId;
    common_vendor.watch(boxHeight, () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        boxHeight.value = Math.round(boxHeight.value);
      }, 10);
    });
    expose({
      boxHeight
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(
          //@ts-ignore
          (...args) => common_vendor.unref(handleTouchMove) && common_vendor.unref(handleTouchMove)(...args)
        ),
        b: boxHeight.value + "px"
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-5c47ca5b"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/components/Resizable/Resizable.vue"]]);
wx.createComponent(Component);
