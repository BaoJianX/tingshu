"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "chat-input-bar",
  data() {
    return {
      msg: ""
    };
  },
  methods: {
    sendClick() {
      if (!this.msg.length)
        return;
      this.$emit("send", this.msg);
      this.msg = "";
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.sendClick && $options.sendClick(...args)),
    b: $data.msg,
    c: common_vendor.o(($event) => $data.msg = $event.detail.value),
    d: common_vendor.o((...args) => $options.sendClick && $options.sendClick(...args))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-32a7ea19"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/components/chatInputBar/chatInputBar.vue"]]);
wx.createComponent(Component);
