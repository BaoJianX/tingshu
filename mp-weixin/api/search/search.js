"use strict";
const utils_request = require("../../utils/request.js");
class CateGory extends utils_request.Service {
  /**
   * @description 搜索功能
   * @param  {SearchParamsInterface} params 二级分类Id
   */
  // 搜索
  getSearchAlbumInfo(params) {
    return this.post({
      url: "/api/search/albumInfo",
      data: params
    });
  }
  /**
   * @description: 获取搜索建议
   * @param {string} keyword 搜索关键字
   * @return {*}
   */
  getSearchSuggestions(keyword) {
    return this.get({
      url: `/api/search/albumInfo/completeSuggest/${keyword}`,
      loading: false
    });
  }
}
const search = new CateGory();
exports.search = search;
