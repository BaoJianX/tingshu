"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_constant = require("../../utils/constant.js");
require("../../config/confjg.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "chatItem",
  props: {
    item: {
      type: Object,
      required: true,
      default: function() {
        return {
          time: "",
          icon: "",
          name: "",
          content: "",
          isMe: false,
          messageType: utils_constant.ChatMessageType.PUBLIC_MSG
        };
      }
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.item.messageType === common_vendor.unref(utils_constant.ChatMessageType).PUBLIC_MSG
      }, __props.item.messageType === common_vendor.unref(utils_constant.ChatMessageType).PUBLIC_MSG ? common_vendor.e({
        b: __props.item.time && __props.item.time.length
      }, __props.item.time && __props.item.time.length ? {
        c: common_vendor.t(__props.item.time)
      } : {}, {
        d: __props.item.icon,
        e: common_vendor.t(__props.item.name),
        f: __props.item.isMe ? 1 : "",
        g: common_vendor.t(__props.item.content),
        h: __props.item.isMe ? 1 : "",
        i: __props.item.isMe ? 1 : "",
        j: __props.item.isMe ? 1 : ""
      }) : {}, {
        k: __props.item.messageType === common_vendor.unref(utils_constant.ChatMessageType).JOIN_CHAT
      }, __props.item.messageType === common_vendor.unref(utils_constant.ChatMessageType).JOIN_CHAT ? {
        l: common_vendor.t(__props.item.name)
      } : {}, {
        m: __props.item.messageType === common_vendor.unref(utils_constant.ChatMessageType).CLOSE_SOCKET
      }, __props.item.messageType === common_vendor.unref(utils_constant.ChatMessageType).CLOSE_SOCKET ? {
        n: common_vendor.t(__props.item.name)
      } : {});
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1ee2ee70"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/components/chatItem/chatItem.vue"]]);
wx.createComponent(Component);
