"use strict";
const common_vendor = require("../../common/vendor.js");
const Grace6_js_grace = require("../../Grace6/js/grace.js");
require("../../stores/user.js");
const utils_utils = require("../../utils/utils.js");
const api_albums_albums = require("../../api/albums/albums.js");
const stores_player = require("../../stores/player.js");
require("../../Grace6/js/md5.js");
require("../../utils/constant.js");
require("../../config/confjg.js");
require("../../api/user/user.js");
require("../../utils/request.js");
require("../../api/order/order.js");
if (!Array) {
  const _easycom_gui_switch_navigation2 = common_vendor.resolveComponent("gui-switch-navigation");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_CommentList2 = common_vendor.resolveComponent("CommentList");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_gui_switch_navigation2 + _easycom_uni_icons2 + _easycom_CommentList2 + _easycom_uni_popup2)();
}
const _easycom_gui_switch_navigation = () => "../../Grace6/components/gui-switch-navigation.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_CommentList = () => "../../components/CommentList/CommentList.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_gui_switch_navigation + _easycom_uni_icons + _easycom_CommentList + ZPaging + _easycom_uni_popup)();
}
const ZPaging = () => "../../uni_modules/z-paging/components/z-paging/z-paging.js";
// 播放页实例世代号：BackgroundAudioManager 是全局单例，老页面实例注册的回调/定时器
// 不会自动注销，靠这个世代号让它们全部失效，避免多套回调抢着 seek / 写库
let activePlayerGeneration = 0;
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "player",
  props: {
    albumId: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    const playerStore = stores_player.usePlayerStore();
    // 本次页面实例的世代号
    const myGeneration = ++activePlayerGeneration;
    const systemHeight = common_vendor.ref(0);
    const swiperHeight = common_vendor.computed(() => {
      return systemHeight.value - common_vendor.index.upx2px(113);
    });
    const scrollHeight = common_vendor.computed(() => {
      return systemHeight.value - common_vendor.index.upx2px(113) - common_vendor.index.upx2px(135);
    });
    const currentIndex = common_vendor.ref(0);
    const bgAudioManager = common_vendor.index.getBackgroundAudioManager();
    const isCollect = common_vendor.ref(false);
    let trackInfo = common_vendor.ref();
    let trackStaVo = common_vendor.ref();
    let album = common_vendor.ref();
    const audios = common_vendor.reactive({
      /** 音频总时长 */
      duration: "00:00",
      /** 当前进度 */
      currentTime: "00:00",
      /** 音频播放状态 */
      playStatus: false,
      /** 正在播放的音频id */
      trackId: 0,
      /** 专辑id */
      albumId: 0,
      /** 跳转进度 */
      breakSecond: 0
    });
    const audioList = common_vendor.ref([]);
    const sliders = common_vendor.reactive({
      /** 是否正在拖动进度条 */
      isDraging: false,
      /** 进度条时间 */
      progressTime: 0,
      /** 进度条总长度 */
      max: 0
    });
    const albumPopupRef = common_vendor.ref();
    const navchange = (index) => {
      currentIndex.value = index;
    };
    const openAlbumPopup = () => {
      albumPopupRef.value.open();
    };
    const closeAlbumPopup = () => {
      albumPopupRef.value.close();
    };
    const sliderChange = (e) => {
      const position = e.detail.value;
      seekAudio(position);
    };
    const handleSliderMoveStart = () => {
      sliders.isDraging = true;
    };
    const handleSliderMoveEnd = () => {
      sliders.isDraging = false;
      saveListenProcess();
    };
    const seekAudio = (position) => {
      bgAudioManager.seek(position);
      audios.currentTime = utils_utils.formatTime(position);
      sliders.progressTime = position;
    };
    // 主动保存当前进度（拖动松手 / 暂停 / 页面销毁时调用），不必等 10 秒的定时器
    const saveListenProcess = async () => {
      if (!audios.trackId) {
        return;
      }
      const params = {
        albumId: audios.albumId,
        trackId: audios.trackId,
        breakSecond: sliders.progressTime
      };
      try {
        await api_albums_albums.albumsService.updateListenProcess(params);
      } catch (error) {
        console.log(error);
      }
    };
    // 每 10 秒兜底保存一次；同一页面实例只起一个定时器，老实例的靠世代号失效
    let saveTimer = null;
    const startPeriodicSave = () => {
      if (saveTimer) {
        return;
      }
      saveTimer = setInterval(async () => {
        if (myGeneration !== activePlayerGeneration) {
          return;
        }
        if (bgAudioManager.paused) {
          return;
        }
        const params = {
          albumId: audios.albumId,
          trackId: audios.trackId,
          breakSecond: sliders.progressTime
        };
        try {
          await api_albums_albums.albumsService.updateListenProcess(params);
        } catch (error) {
          console.log(error);
        }
      }, 1e4);
    };
    const handleJump = () => {
      common_vendor.index.navigateBack();
    };
    const changeAudio = (item) => {
      if (item.trackId !== audios.trackId) {
        getTrackInfo(item.trackId);
      }
    };
    const prevAudio = () => {
      var _a;
      const firstId = (_a = audioList.value[0]) == null ? void 0 : _a.trackId;
      if (firstId === audios.trackId) {
        common_vendor.index.showToast({
          title: "当前已经是第一首了",
          icon: "none"
        });
        return;
      }
      console.log(audios.trackId);
      let id = 0;
      audioList.value.forEach((item, index) => {
        var _a2;
        if (item.trackId === audios.trackId) {
          id = (_a2 = audioList.value[index - 1]) == null ? void 0 : _a2.trackId;
        }
      });
      getTrackInfo(id);
    };
    const nextAudio = () => {
      var _a;
      const len = audioList.value.length;
      const lastId = (_a = audioList.value[len - 1]) == null ? void 0 : _a.trackId;
      if (lastId === audios.trackId) {
        common_vendor.index.showToast({
          title: "当前播放列表已是最新的了，请加载更多",
          icon: "none"
        });
        return;
      }
      console.log(audios.trackId);
      let id = 0;
      audioList.value.forEach((item, index) => {
        var _a2;
        if (item.trackId === audios.trackId) {
          id = (_a2 = audioList.value[index + 1]) == null ? void 0 : _a2.trackId;
        }
      });
      getTrackInfo(id);
    };
    // 本次进入页面时，这首歌是否已经在后台播放中（是则沿用当前进度，不打断、不 seek）
    let isSameTrackPlaying = false;
    const createBgAudioManager = () => {
      var _a, _b, _c;
      if (bgAudioManager) {
        const targetSrc = (_c = trackInfo.value) == null ? void 0 : _c.mediaUrl;
        // 同一首已经在播 → 页面只当遥控器：不 stop、不重设 src、不 seek，把 UI 同步到音频真实进度
        if (targetSrc && bgAudioManager.src === targetSrc && !bgAudioManager.paused) {
          isSameTrackPlaying = true;
          const playingTime = bgAudioManager.currentTime;
          if (playingTime) {
            sliders.progressTime = playingTime;
            audios.currentTime = utils_utils.formatTime(playingTime);
          }
          if (bgAudioManager.duration) {
            audios.duration = utils_utils.formatTime(bgAudioManager.duration);
            sliders.max = bgAudioManager.duration;
          }
          audios.playStatus = true;
          initAudio(bgAudioManager);
          return;
        }
        isSameTrackPlaying = false;
        if (!bgAudioManager.paused) {
          bgAudioManager.stop();
        }
        bgAudioManager.title = (_a = trackInfo.value) == null ? void 0 : _a.trackTitle;
        bgAudioManager.coverImgUrl = (_b = trackInfo.value) == null ? void 0 : _b.coverUrl;
        bgAudioManager.src = targetSrc;
        initAudio(bgAudioManager);
      }
    };
    const pauseAudio = () => {
      bgAudioManager.pause();
    };
    const playAudio = () => {
      bgAudioManager.play();
    };
    const initAudio = (ctx) => {
      // 本次音频是否已定位过：只允许第一次播放时 seek，否则暂停恢复会被旧断点拉回去；
      // 同一首正在后台播放时视为已定位 —— 绝不能 seek，否则会把正在播的音频拉回存档位置
      let hasSeeked = isSameTrackPlaying;
      ctx.onTimeUpdate(() => {
        if (myGeneration !== activePlayerGeneration)
          return;
        if (!sliders.isDraging) {
          const currentTime = ctx.currentTime;
          if (currentTime) {
            sliders.progressTime = ctx.currentTime;
            audios.currentTime = utils_utils.formatTime(currentTime);
          }
        }
      });
      ctx.onCanplay(() => {
        if (myGeneration !== activePlayerGeneration)
          return;
        setTimeout(() => {
          console.log("音频长度", bgAudioManager.duration);
          const duration = bgAudioManager.duration;
          audios.duration = utils_utils.formatTime(duration);
          sliders.max = duration;
        }, 300);
      });
      ctx.onPlay(() => {
        if (myGeneration !== activePlayerGeneration)
          return;
        audios.playStatus = true;
        playerStore.changePlayStatus(true);
        if (!hasSeeked) {
          hasSeeked = true;
          seekAudio(audios.breakSecond);
        }
        startPeriodicSave();
      });
      ctx.onPause(() => {
        if (myGeneration !== activePlayerGeneration)
          return;
        audios.playStatus = false;
        playerStore.changePlayStatus(false);
        saveListenProcess();
      });
      ctx.onEnded(() => {
        if (myGeneration !== activePlayerGeneration)
          return;
        nextAudio();
      });
      ctx.onError(() => {
        if (myGeneration !== activePlayerGeneration)
          return;
        audios.playStatus = false;
        playerStore.changePlayStatus(false);
      });
      // 同一首已经在后台播放时 onPlay 不会再触发，这里直接把定时保存启动起来
      if (isSameTrackPlaying) {
        startPeriodicSave();
      }
    };
    const handleComment = () => {
      currentIndex.value = 1;
    };
    const getIsCollect = async () => {
      const res = await api_albums_albums.albumsService.isCollectTrack(audios.trackId);
      isCollect.value = res.data;
    };
    const handleCollect = async () => {
      const res = await api_albums_albums.albumsService.collectTrack(audios.trackId);
      isCollect.value = res.data;
      common_vendor.index.showToast({
        title: !res.data ? "取消收藏成功" : "收藏成功",
        icon: "none"
      });
    };
    const getTrackInfo = async (trackId) => {
      var _a;
      try {
        const res = await api_albums_albums.albumsService.getTrackInfo(trackId);
        trackInfo.value = res.data;
        audios.trackId = (_a = res.data) == null ? void 0 : _a.id;
        createBgAudioManager();
      } catch (error) {
        console.log(error);
      }
    };
    const getTrackStatVo = async () => {
      try {
        const res = await api_albums_albums.albumsService.getTrackStaVo(audios.trackId);
        trackStaVo.value = res.data;
      } catch (error) {
        console.log(error);
      }
    };
    const zPagingRef = common_vendor.ref();
    const getAblumAudioList = async (page, limit) => {
      const params = {
        page,
        limit,
        albumId: audios.albumId
      };
      const res = await api_albums_albums.albumsService.getAlbumTrackList(params);
      zPagingRef.value.complete(res.data.records);
    };
    const getAlbumDetail = async (id) => {
      const res = await api_albums_albums.albumsService.getAlbumInfo(id);
      album.value = res.data;
    };
    const getBreakSecond = async () => {
      const res = await api_albums_albums.albumsService.getTrackBreakSecond(audios.trackId);
      audios.breakSecond = res.data;
    };
    common_vendor.onLoad(async (options) => {
      console.log("options", options);
      if (JSON.stringify(options) !== "{}") {
        audios.trackId = options.trackId;
        audios.albumId = options.albumId;
      } else {
        const { data } = await api_albums_albums.albumsService.getLatelyTrack();
        audios.trackId = data.trackId;
        audios.albumId = data.albumId;
      }
      getBreakSecond();
      getAlbumDetail(audios.albumId);
      getTrackInfo(audios.trackId);
      getAblumAudioList(1, 10);
      getTrackStatVo();
      getIsCollect();
    });
    common_vendor.onMounted(() => {
      var systemInfo = Grace6_js_grace.graceJS.system();
      systemHeight.value = systemInfo.safeArea.height;
    });
    // 页面销毁时兜底保存一次（编译产物没有导出 onUnload，用 Vue 的 onUnmounted 代替）
    if (typeof common_vendor.onUnmounted === "function") {
      common_vendor.onUnmounted(() => {
        if (myGeneration === activePlayerGeneration) {
          saveListenProcess();
        }
      });
    }
    return (_ctx, _cache) => {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      return common_vendor.e({
        a: common_vendor.o(handleJump),
        b: common_vendor.o(navchange),
        c: common_vendor.p({
          activeLineClass: ["gui-nav-scale", "gui-bg-white"],
          titleClass: ["gui-color-white"],
          items: [{
            id: 0,
            name: "播放"
          }, {
            id: 1,
            name: "评论"
          }],
          activeLineWidth: "50rpx",
          size: 100,
          width: 200,
          currentIndex: currentIndex.value
        }),
        d: common_vendor.t((_a = common_vendor.unref(trackStaVo)) == null ? void 0 : _a.playStatNum),
        e: (_b = common_vendor.unref(trackInfo)) == null ? void 0 : _b.coverUrl,
        f: common_vendor.t((_c = common_vendor.unref(trackInfo)) == null ? void 0 : _c.trackTitle),
        g: common_vendor.t(audios.currentTime),
        h: sliders.max,
        i: sliders.progressTime,
        j: common_vendor.o(sliderChange),
        k: common_vendor.o(
          //@ts-ignore
          (...args) => handleSliderMoveStart && handleSliderMoveStart(...args)
        ),
        l: common_vendor.o(handleSliderMoveEnd),
        m: common_vendor.t(audios.duration),
        n: common_vendor.o(openAlbumPopup),
        o: common_vendor.o(prevAudio),
        p: audios.playStatus
      }, audios.playStatus ? {
        q: common_vendor.o(pauseAudio),
        r: common_vendor.p({
          ["custom-prefix"]: "iconfont",
          type: "pause",
          size: "80rpx",
          color: "#fff"
        })
      } : {
        s: common_vendor.o(playAudio)
      }, {
        t: common_vendor.o(nextAudio),
        v: (_d = common_vendor.unref(album)) == null ? void 0 : _d.coverUrl,
        w: common_vendor.t((_e = common_vendor.unref(album)) == null ? void 0 : _e.albumTitle),
        x: common_vendor.t((_f = common_vendor.unref(trackStaVo)) == null ? void 0 : _f.collectStatNum),
        y: common_vendor.unref(scrollHeight) + "px",
        z: common_vendor.o(handleComment),
        A: isCollect.value
      }, isCollect.value ? {} : {}, {
        B: common_vendor.t(((_g = common_vendor.unref(trackStaVo)) == null ? void 0 : _g.collectStatNum) || 0),
        C: common_vendor.o(handleCollect),
        D: common_vendor.t(((_h = common_vendor.unref(trackStaVo)) == null ? void 0 : _h.commentStatNum) || 0),
        E: common_vendor.o(handleComment),
        F: common_vendor.unref(scrollHeight) + "px",
        G: common_vendor.p({
          albumId: __props.albumId,
          trackId: audios.trackId
        }),
        H: currentIndex.value,
        I: common_vendor.unref(swiperHeight) + "px",
        J: common_vendor.o(closeAlbumPopup),
        K: common_vendor.f(audioList.value, (item, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.orderNum + 1),
            b: common_vendor.n((item == null ? void 0 : item.trackId) == audios.trackId ? "track-item-title-checked" : "gui-color-grey1"),
            c: common_vendor.t(item.trackTitle),
            d: common_vendor.n((item == null ? void 0 : item.trackId) == audios.trackId ? "track-item-title-checked" : "gui-primary-text "),
            e: (item == null ? void 0 : item.trackId) == audios.trackId
          }, (item == null ? void 0 : item.trackId) == audios.trackId ? {} : {}, {
            f: common_vendor.t(item.playStatNum),
            g: common_vendor.t(item == null ? void 0 : item.albumCommentStatNum),
            h: common_vendor.t(common_vendor.unref(utils_utils.formatTime)(item.mediaDuration)),
            i: item.trackId,
            j: common_vendor.o(($event) => changeAudio(item), item.trackId)
          });
        }),
        L: common_vendor.sr(zPagingRef, "303880ee-4,303880ee-3", {
          "k": "zPagingRef"
        }),
        M: common_vendor.o(getAblumAudioList),
        N: common_vendor.o(($event) => audioList.value = $event),
        O: common_vendor.p({
          ["paging-style"]: {
            height: "500px"
          },
          fixed: false,
          modelValue: audioList.value
        }),
        P: common_vendor.sr(albumPopupRef, "303880ee-3", {
          "k": "albumPopupRef"
        }),
        Q: common_vendor.p({
          safeArea: true,
          type: "bottom",
          backgroundColor: "#fff"
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/pages/player/player.vue"]]);
wx.createPage(MiniProgramPage);
