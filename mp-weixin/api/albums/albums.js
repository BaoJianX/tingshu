"use strict";
const utils_request = require("../../utils/request.js");
class CateGory extends utils_request.Service {
  /**
   * @description 新增专辑
   * @param {AlbumInfoInterface} albumInfo
   * @return {*}
   * @docs http://139.198.163.91:8501/doc.html
   */
  addAlbum(albumInfo) {
    return this.post({
      url: `/api/album/albumInfo/saveAlbumInfo`,
      data: albumInfo
    });
  }
  /**
   * @description 修改
   * @param {AlbumInfoInterface} albumInfo
   * @return {*}
   * @docs http://139.198.163.91:8501/doc.html
   */
  editAlbum(albumInfo) {
    return this.put({
      url: `/api/album/albumInfo/updateAlbumInfo/${albumInfo.id}`,
      data: albumInfo
    });
  }
  /**
   * @description: 获取专辑信息
   * @param {number} id 专辑id
   * @return {*}
   * @docs http://139.198.163.91:8501/doc.html
   */
  getAlbumInfo(id) {
    return this.get({
      url: `/api/album/albumInfo/getAlbumInfo/${id}`
    });
  }
  /**
   * @description: 删除专辑信息
   * @param {number} id 专辑id
   * @return {*}
   * @docs http://139.198.163.91:8501/doc.html
   */
  deleteAlbumInfo(id) {
    return this.delete({
      url: `/api/album/albumInfo/removeAlbumInfo/${id}`
    });
  }
  /**
   * @description: 获取声音信息
   * @param {number} id 声音id
   * @return {*}
   * @docs http://139.198.163.91:8501/doc.html
   */
  getTrackInfo(id) {
    return this.get({
      url: `/api/album/trackInfo/getTrackInfo/${id}`
    });
  }
  /**
   * @description: 删除声音信息
   * @param {number} id 声音id
   * @return {*}
   * @docs http://139.198.163.91:8501/doc.html
   */
  deleteTrackInfo(id) {
    return this.delete({
      url: `/api/album/trackInfo/removeTrackInfo/${id}`
    });
  }
  /**
   * @description: 获取当前用户的分页专辑列表
   * @param {WorksInfoPageInterface} albumInfoPage
   * @return {*}
   */
  getAlbumList(albumInfoPage) {
    return this.post({
      url: `/api/album/albumInfo/findUserAlbumPage/${albumInfoPage.page}/${albumInfoPage.limit}`,
      data: albumInfoPage
    });
  }
  // 获取所有的专辑列表
  /**
   * @description: 获取所有的专辑列表
   * @return {*}
   */
  getAllAlbumList() {
    return this.get({
      url: `/api/album/albumInfo/findUserAllAlbumList`
    });
  }
  /**
   * @description: 新增声音信息
   * @param {TrackInfoInterface} trackInfo
   * @return {*}
   */
  addTrackInfo(trackInfo) {
    return this.post({
      url: `/api/album/trackInfo/saveTrackInfo`,
      data: trackInfo
    });
  }
  /**
   * @description: 修改声音信息
   * @param {TrackInfoInterface} trackInfo
   * @return {*}
   */
  editTrackInfo(trackInfo) {
    return this.put({
      url: `/api/album/trackInfo/updateTrackInfo/${trackInfo.id}`,
      data: trackInfo
    });
  }
  /**
   * @description: 获取当前用户声音分页列表
   * @param {WorksInfoPageInterface} trackListInfoPage
   * @return {*}
   */
  getTrackList(trackListInfoPage) {
    return this.post({
      url: `/api/album/trackInfo/findUserTrackPage/${trackListInfoPage.page}/${trackListInfoPage.limit}`,
      data: trackListInfoPage
    });
  }
  /**
   * @description: 获取专辑详情
   * @param {number | string} albumId
   * @return {*}
   */
  getAlbumDetail(albumId) {
    return this.get({
      url: `/api/search/albumInfo/${albumId}`
    });
  }
  /**
   * @description: 获取专辑声音分页列表
   * @param {QueryTrackInterface} trackListInfoPage
   * @return {*}
   */
  getAlbumTrackList(trackListInfoPage) {
    return this.get({
      url: `/api/album/trackInfo/findAlbumTrackPage/${trackListInfoPage.albumId}/${trackListInfoPage.page}/${trackListInfoPage.limit}`
    });
  }
  /**
   * @description: 获取声音统计信息
   * @param {QueryTrackInterface} trackListInfoPage
   * @returns {*}
   */
  getTrackStaVo(trackId) {
    return this.get({
      url: `/api/album/trackInfo/getTrackStatVo/${trackId}`
    });
  }
  /**
   * @description 获取订阅专辑分页列表
   * @param  { page: number, limit: number } pageInfo 分页信息
   */
  getSubscribeAlbums(pageInfo) {
    return this.get({
      url: `/api/user/userInfo/findUserSubscribePage/${pageInfo.page}/${pageInfo.limit}`
    });
  }
  /**
   * @description 获取收藏分页列表
   * @param  { page: number, limit: number } pageInfo 分页信息
   */
  getCollectTrack(pageInfo) {
    return this.get({
      url: `/api/user/userInfo/findUserCollectPage/${pageInfo.page}/${pageInfo.limit}`
    });
  }
  /**
   * @description 获取历史声音分页列表
   * @param  { page: number, limit: number } pageInfo 分页信息
   */
  getHistoryTrack(pageInfo) {
    return this.get({
      url: `/api/user/userListenProcess/findUserPage/${pageInfo.page}/${pageInfo.limit}`
    });
  }
  /**
   * @description 订阅专辑
   */
  subscribeAlbum(albumId) {
    return this.get({
      url: `/api/user/userInfo/subscribe/${albumId}`
    });
  }
  /**
   * @description 是否订阅专辑
   */
  isSubscribeAlbum(albumId) {
    return this.get({
      url: `/api/user/userInfo/isSubscribe/${albumId}`
    });
  }
  /**
   * @description 收藏声音
   */
  collectTrack(trackId) {
    return this.get({
      url: `/api/user/userInfo/collect/${trackId}`
    });
  }
  /**
   * @description 是否收藏声音
   */
  isCollectTrack(trackId) {
    return this.get({
      url: `/api/user/userInfo/isCollect/${trackId}`
    });
  }
  /**
   * @description 根据id删除播放历史
   */
  deleteHistoryTrack(id) {
    return this.delete({
      url: `/api/user/userListenProcess/delete/${id}`
    });
  }
  /**
   * @description 获取排行榜单列表
   */
  findRankingList(category1Id, dimension) {
    return this.get({
      url: `/api/search/albumInfo/findRankingList/${category1Id}/${dimension}`
    });
  }
  /**
   * @description: 获取最近的一次播放历史
   * @returns {*}
   */
  getLatelyTrack() {
    return this.get({
      url: "/api/user/userListenProcess/getLatelyTrack"
    });
  }
  /**
   * @description: 更新播放进度
   * @returns {*}
   */
  updateListenProcess(data) {
    return this.post({
      url: "/api/user/userListenProcess/updateListenProcess",
      data,
      loading: false
    });
  }
  /**
   * @description: 获取声音的上次跳出时间
   * @returns {*}
   */
  getTrackBreakSecond(trackId) {
    return this.get({
      url: `/api/user/userListenProcess/getTrackBreakSecond/${trackId}`
    });
  }
}
const albumsService = new CateGory();
exports.albumsService = albumsService;
