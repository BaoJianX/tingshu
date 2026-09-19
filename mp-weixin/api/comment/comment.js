"use strict";
const utils_request = require("../../utils/request.js");
class Comment extends utils_request.Service {
  /**
   * @description 专辑评论列表
   * @param  {SearchParamsInterface} params 二级分类Id
   */
  getCommentList(params) {
    return this.get({
      url: `/api/comment/findCommentPage/${params.albumId}/${params.trackId}/${params.page}/${params.limit}`
    });
  }
  /**
   * @description 点赞与取消点赞评论
   * @param albumId
   * @param commentId
   */
  praiseComment(albumId, commentId) {
    return this.get({
      url: `/api/comment/praise/${albumId}/${commentId}`,
      loading: false
    });
  }
  /**
   * @description 新增评论接口
   * @param albumId
   * @param replyCommentId
   * @param content
   * @param albumCommentScore
   * @param trackId
   */
  addComment(albumId, trackId, replyCommentId, content, albumCommentScore = 10) {
    return this.post({
      url: `/api/comment/save`,
      data: {
        albumId,
        replyCommentId,
        content,
        albumCommentScore,
        trackId
      }
    });
  }
  /**
   * @description 删除评论
   * @param albumId
   * @param commentId
   */
  deleteComment(albumId, commentId) {
    return this.get({
      url: `/api/comment/remove/${albumId}/${commentId}`
    });
  }
}
const commentService = new Comment();
exports.commentService = commentService;
