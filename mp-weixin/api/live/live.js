"use strict";
const utils_request = require("../../utils/request.js");
class CateGory extends utils_request.Service {
  /**
   * @description 获取直播间列表
   */
  getLiveList() {
    return this.get({
      url: `/api/live/liveRoom/findLiveList`
    });
  }
  /**
   * @description 根据id获取直播间信息
   * @param  {string | number} id 直播间id
   */
  getLiveInfo(id) {
    return this.get({
      url: `/api/live/liveRoom/getById/${id}`
    });
  }
  /**
   * @description 根据直播标签列表
   */
  getLiveTagList() {
    return this.get({
      url: `/api/live/liveTag/findAllLiveTag`
    });
  }
  /**
   * @description 获取当前用户的直播间
   */
  getCurrentLiveRoom() {
    return this.get({
      url: `/api/live/liveRoom/getCurrentLive`
    });
  }
  /**
   * @description 创建直播间
   */
  createLiveRoom(data) {
    return this.post({
      url: `/api/live/liveRoom/saveLiveRoom`,
      data
    });
  }
}
const liveService = new CateGory();
exports.liveService = liveService;
