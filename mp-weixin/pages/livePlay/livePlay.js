"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_user = require("../../stores/user.js");
const utils_constant = require("../../utils/constant.js");
const config_confjg = require("../../config/confjg.js");
const api_live_live = require("../../api/live/live.js");
const hooks_useUniWebsocket = require("../../hooks/useUniWebsocket.js");
require("../../utils/utils.js");
require("../../api/user/user.js");
require("../../utils/request.js");
require("../../api/order/order.js");
if (!Array) {
  const _easycom_chatItem2 = common_vendor.resolveComponent("chatItem");
  _easycom_chatItem2();
}
const _easycom_chatItem = () => "../../components/chatItem/chatItem.js";
if (!Math) {
  (_easycom_chatItem + ChatInputBar + ZPaging)();
}
const ZPaging = () => "../../uni_modules/z-paging/components/z-paging/z-paging.js";
const ChatInputBar = () => "../../components/chatInputBar/chatInputBar.js";
const _sfc_defineComponent = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "livePlay",
  props: {
    id: {
      type: String,
      default: "1"
    }
  },
  setup(__props) {
    const props = __props;
    const zPagingRef = common_vendor.ref();
    const userStore = stores_user.useUserStore();
    const { socketTask, connect, disconnect, sendMessage } = hooks_useUniWebsocket.useUniWebSocket(`${config_confjg.WebSocket_BASE_URL}/${props.id}/${userStore.token}`, onMessageCallBack);
    const liveInfo = common_vendor.ref({});
    let dataList = common_vendor.ref([]);
    function onMessageCallBack(data) {
      console.log("接受到服务器消息的回调", data);
      let params = {
        time: data.time,
        icon: data.fromUser.avatarUrl,
        name: data.fromUser.nickname,
        content: data.msgContent,
        isMe: data.fromUser.userId === userStore.user.id,
        messageType: data.msgType
      };
      zPagingRef.value.addChatRecordData(params);
    }
    const doSend = (msg) => {
      let params = {
        fromUser: {
          avatarUrl: userStore.user.avatarUrl,
          nickname: userStore.user.nickname,
          userId: userStore.user.id
        },
        liveRoomId: props.id,
        msgContent: msg,
        msgType: utils_constant.ChatMessageType.PUBLIC_MSG
      };
      sendMessage(params);
    };
    const getLiveInfo = async () => {
      try {
        const res = await api_live_live.liveService.getLiveInfo(props.id);
        console.log("res", res);
        liveInfo.value = res.data;
      } catch (error) {
        console.log(error);
      }
    };
    common_vendor.onMounted(() => {
      getLiveInfo();
    });
    common_vendor.onPageScroll(async (e) => {
      if (e.scrollTop < 10) {
        zPagingRef.value.doChatRecordLoadMore();
      }
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(common_vendor.unref(dataList), (item, index, i0) => {
          return {
            a: "1a284cce-1-" + i0 + ",1a284cce-0",
            b: common_vendor.p({
              item
            }),
            c: `z-paging-${index}`,
            d: index
          };
        }),
        b: common_vendor.o(doSend),
        c: common_vendor.sr(zPagingRef, "1a284cce-0", {
          "k": "zPagingRef"
        }),
        d: common_vendor.o(($event) => common_vendor.isRef(dataList) ? dataList.value = $event : dataList = $event),
        e: common_vendor.p({
          ["use-page-scroll"]: true,
          ["use-chat-record-mode"]: true,
          [":auto"]: false,
          modelValue: common_vendor.unref(dataList)
        })
      };
    };
  }
});
_sfc_defineComponent.__runtimeHooks = 1;
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_defineComponent, [["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/pages/livePlay/livePlay.vue"]]);
wx.createPage(MiniProgramPage);
