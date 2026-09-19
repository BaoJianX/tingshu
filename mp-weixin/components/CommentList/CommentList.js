"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../stores/user.js");
const api_comment_comment = require("../../api/comment/comment.js");
require("../../utils/constant.js");
require("../../config/confjg.js");
require("../../utils/utils.js");
require("../../api/user/user.js");
require("../../utils/request.js");
require("../../api/order/order.js");
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_easycom_uni_easyinput2 + _easycom_uni_icons2)();
}
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_icons + ZPaging)();
}
const ZPaging = () => "../../uni_modules/z-paging/components/z-paging/z-paging.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "CommentList",
  props: {
    albumId: {
      type: String,
      required: true
    },
    trackId: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const zPagingRef = common_vendor.ref();
    const commentList = common_vendor.ref([]);
    const commentEmptyInfo = common_vendor.ref({
      replyRelevantInformation: {
        replyPlaceholder: "请输入回复内容",
        replyCommentId: "0",
        replyContent: ""
      }
    });
    const getComment = async (pageNo, pageSize) => {
      const params = {
        page: pageNo,
        limit: pageSize,
        albumId: props.albumId,
        trackId: props.trackId
      };
      try {
        const res = await api_comment_comment.commentService.getCommentList(params);
        res.data.records.forEach((item) => {
          item.replyRelevantInformation = {
            replyPlaceholder: "请输入回复内容",
            replyCommentId: "",
            replyContent: ""
          };
        });
        zPagingRef.value.complete(res.data.records);
        console.log(res);
      } catch (error) {
        console.log(error);
        zPagingRef.value.complete(false);
      }
    };
    const handlePraise = async (item) => {
      const params = {
        albumId: item.albumId,
        commentId: item.id
      };
      const res = await api_comment_comment.commentService.praiseComment(params.albumId, params.commentId);
      item.isPraise = !item.isPraise;
      if (item.isPraise) {
        item.praiseCount++;
      } else {
        item.praiseCount--;
      }
      console.log(res);
    };
    const handleOnClickItemReply = (item, clickItem) => {
      console.log(item);
      item.replyRelevantInformation.replyCommentId = clickItem.id;
      item.replyRelevantInformation.replyPlaceholder = `回复${clickItem.nickname}`;
    };
    const handleReplyComment = async (item) => {
      if (!item.replyRelevantInformation.replyContent) {
        common_vendor.index.showToast({
          title: "请输入回复内容",
          icon: "none",
          duration: 1500
        });
        return;
      }
      console.log("item", item);
      const params = {
        albumId: item.albumId || props.albumId,
        trackId: props.trackId,
        commentId: item.replyRelevantInformation.replyCommentId || item.id,
        content: item.replyRelevantInformation.replyContent
      };
      const res = await api_comment_comment.commentService.addComment(params.albumId, params.trackId, params.commentId, params.content);
      console.log(res);
      item.replyRelevantInformation.replyContent = "";
      item.replyRelevantInformation.replyCommentId = "0";
      item.replyRelevantInformation.replyPlaceholder = "请输入回复内容";
      zPagingRef.value.reload();
    };
    const handleDeleteComment = async (item, index, replyIndex = -1) => {
      var _a;
      const params = {
        albumId: item.albumId,
        commentId: item.id
      };
      await api_comment_comment.commentService.deleteComment(params.albumId, params.commentId);
      if (replyIndex === -1) {
        commentList.value.splice(index, 1);
      } else {
        (_a = commentList.value[index].replyCommentList) == null ? void 0 : _a.splice(replyIndex, 1);
      }
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => commentEmptyInfo.value.replyRelevantInformation.replyContent = $event),
        b: common_vendor.p({
          type: "textarea",
          trim: true,
          placeholder: commentEmptyInfo.value.replyRelevantInformation.replyPlaceholder,
          modelValue: commentEmptyInfo.value.replyRelevantInformation.replyContent
        }),
        c: common_vendor.o(($event) => handleReplyComment(commentEmptyInfo.value)),
        d: common_vendor.f(commentList.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.avatarUrl,
            b: common_vendor.t(item.nickname),
            c: common_vendor.t(item.praiseCount),
            d: common_vendor.o(($event) => handlePraise(item), index),
            e: common_vendor.n(item.isPraise ? "gui-color-orange" : ""),
            f: common_vendor.t(item.content),
            g: item.deleteMark === "1"
          }, item.deleteMark === "1" ? {
            h: common_vendor.o(($event) => handleDeleteComment(item, index), index),
            i: "9fd52490-2-" + i0 + ",9fd52490-0",
            j: common_vendor.p({
              ["custom-prefix"]: "iconfont",
              type: "shanchu",
              size: "10"
            })
          } : {}, {
            k: common_vendor.o(($event) => handleOnClickItemReply(item, item), index),
            l: item.replyCommentList
          }, item.replyCommentList ? {
            m: common_vendor.f(item.replyCommentList, (itemRe, indexRe, i1) => {
              var _a;
              return common_vendor.e({
                a: !itemRe.parent
              }, !itemRe.parent ? common_vendor.e({
                b: common_vendor.t(itemRe.nickname),
                c: common_vendor.t(itemRe.content),
                d: itemRe.deleteMark === "1"
              }, itemRe.deleteMark === "1" ? {
                e: common_vendor.o(($event) => handleDeleteComment(itemRe, index, indexRe), itemRe.id),
                f: "9fd52490-3-" + i0 + "-" + i1 + ",9fd52490-0",
                g: common_vendor.p({
                  ["custom-prefix"]: "iconfont",
                  type: "shanchu",
                  size: "10"
                })
              } : {}, {
                h: common_vendor.o(($event) => handleOnClickItemReply(item, itemRe), itemRe.id)
              }) : common_vendor.e({
                i: common_vendor.t((_a = itemRe.parent) == null ? void 0 : _a.nickname),
                j: common_vendor.t(itemRe.nickname),
                k: common_vendor.t(itemRe.content),
                l: itemRe.deleteMark === "1"
              }, itemRe.deleteMark === "1" ? {
                m: common_vendor.o(($event) => handleDeleteComment(itemRe, index, indexRe), itemRe.id),
                n: "9fd52490-4-" + i0 + "-" + i1 + ",9fd52490-0",
                o: common_vendor.p({
                  ["custom-prefix"]: "iconfont",
                  type: "shanchu",
                  size: "10"
                })
              } : {}, {
                p: common_vendor.o(($event) => handleOnClickItemReply(item, itemRe.parent), itemRe.id)
              }), {
                q: itemRe.id
              });
            })
          } : {}, {
            n: "9fd52490-5-" + i0 + ",9fd52490-0",
            o: common_vendor.o(($event) => item.replyRelevantInformation.replyContent = $event, index),
            p: common_vendor.p({
              trim: true,
              placeholder: item.replyRelevantInformation.replyPlaceholder,
              modelValue: item.replyRelevantInformation.replyContent
            }),
            q: common_vendor.o(($event) => handleReplyComment(item), index),
            r: common_vendor.t(item.createTime),
            s: index
          });
        }),
        e: common_vendor.sr(zPagingRef, "9fd52490-0", {
          "k": "zPagingRef"
        }),
        f: common_vendor.o(getComment),
        g: common_vendor.o(($event) => commentList.value = $event),
        h: common_vendor.p({
          ["default-page-size"]: 30,
          ["show-refresher-update-time"]: true,
          ["auto-show-back-to-top"]: true,
          modelValue: commentList.value
        })
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/components/CommentList/CommentList.vue"]]);
wx.createComponent(Component);
