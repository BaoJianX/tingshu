"use strict";
const common_vendor = require("../common/vendor.js");
const utils_constant = require("../utils/constant.js");
const utils_utils = require("../utils/utils.js");
function useUniWebSocket(url, onMessage, heartbeatInterval = 3e3) {
  const socketTask = common_vendor.ref(null);
  const isDisconnect = common_vendor.ref(false);
  const connect = () => {
    if (!socketTask.value || isDisconnect.value) {
      isDisconnect.value = false;
      console.log("WebSocket连接中...", url);
      console.log("socketTask", socketTask);
      socketTask.value = common_vendor.index.connectSocket({
        url,
        complete: () => {
          console.log("WebSocket连接已建立");
          startHeartbeat();
        }
      });
      socketTask.value.onOpen(() => {
        console.log("WebSocket连接已打开");
      });
      socketTask.value.onClose(() => {
        console.log("WebSocket连接已关闭");
        if (!isDisconnect.value) {
          setTimeout(() => {
            console.log("WebSocket重新连接");
            connect();
          }, 1e3);
        }
      });
      socketTask.value.onError((error) => {
        console.error("WebSocket连接发生错误:", error);
      });
      socketTask.value.onMessage((res) => {
        let data = JSON.parse(res.data);
        console.log("收到服务器消息:", data);
        if (onMessage) {
          onMessage(data);
        }
      });
    }
  };
  const disconnect = () => {
    if (socketTask.value) {
      isDisconnect.value = true;
      socketTask.value.close({});
      stopHeartbeat();
      socketTask.value = null;
    }
  };
  let heartbeatTimer = null;
  const startHeartbeat = () => {
    heartbeatTimer = setInterval(() => {
      const pageInfo = utils_utils.getCurrentPageInfo();
      if (pageInfo.route !== "/pages/livePlay/livePlay") {
        disconnect();
        return;
      }
      if (socketTask.value) {
        console.log("发送心跳");
        socketTask.value.send({
          data: JSON.stringify({
            msgType: utils_constant.ChatMessageType.HEART_BEAT
          })
        });
      }
    }, heartbeatInterval);
  };
  const stopHeartbeat = () => {
    clearInterval(heartbeatTimer);
  };
  const sendMessage = (message) => {
    console.log("发送消息:socketTask.value", socketTask.value);
    if (socketTask.value) {
      socketTask.value.send({
        data: JSON.stringify(message)
      });
    }
  };
  common_vendor.onMounted(() => {
    connect();
  });
  common_vendor.onUnmounted(() => {
    disconnect();
  });
  return {
    socketTask,
    connect,
    disconnect,
    sendMessage
  };
}
exports.useUniWebSocket = useUniWebSocket;
