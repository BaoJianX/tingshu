"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "gui-page-loading",
  props: {},
  data() {
    return {
      isLoading: false,
      BindingXObjs: [null, null, null],
      AnimateObjs: [null, null, null],
      animateTimer: 800,
      intervalID: null
    };
  },
  watch: {},
  methods: {
    stopfun: function(e) {
      e.stopPropagation();
      return null;
    },
    open: function() {
      this.isLoading = true;
    },
    close: function() {
      setTimeout(() => {
        this.isLoading = false;
      }, 100);
    },
    getRefs: function(ref, count, fun) {
      if (count >= 50) {
        fun(this.$refs[ref]);
        return false;
      }
      var refReturn = this.$refs[ref];
      if (refReturn) {
        fun(refReturn);
      } else {
        count++;
        setTimeout(() => {
          this.getRefs(ref, count, fun);
        }, 100);
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.isLoading
  }, $data.isLoading ? {
    b: common_vendor.o((...args) => $options.stopfun && $options.stopfun(...args)),
    c: common_vendor.o((...args) => $options.stopfun && $options.stopfun(...args))
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-cdb33dc3"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/Grace6/components/gui-page-loading.vue"]]);
wx.createComponent(Component);
