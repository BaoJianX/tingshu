"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "gui-page",
  props: {
    fullPage: { type: Boolean, default: false },
    // 自定义头部
    customHeader: { type: Boolean, default: false },
    headerClass: { type: Array, default: function() {
      return [];
    } },
    isHeaderSized: { type: Boolean, default: true },
    statusBarClass: { type: Array, default: function() {
      return [];
    } },
    // 自定义底部
    customFooter: { type: Boolean, default: false },
    footerClass: { type: Array, default: function() {
      return [];
    } },
    footerSpaceClass: { type: Array, default: function() {
      return ["gui-bg-gray", "gui-dark-bg-level-2"];
    } },
    // 挂件
    pendantClass: { type: Array, default: function() {
      return [];
    } },
    // 全屏加载状态
    isLoading: { type: Boolean, default: false },
    isSwitchPage: { type: Boolean, default: false },
    // 吸顶插槽样式
    fixedTopClass: { type: Array, default: function() {
      return [];
    } },
    /* 刷新 */
    refresh: { type: Boolean, default: false },
    refreshText: { type: Array, default: function() {
      return ["继续下拉刷新", "松开手指开始刷新", "数据刷新中", "数据已刷新"];
    } },
    refreshClasses: { type: Array, default: function() {
      return [
        ["gui-color-gray"],
        ["gui-color-gray"],
        ["gui-primary-text"],
        ["gui-color-green"]
      ];
    } },
    refreshFontSize: { type: Number, default: 26 },
    /* 加载更多 */
    loadmore: { type: Boolean, default: false },
    loadMoreText: { type: Array, default: function() {
      return ["", "数据加载中", "已加载全部数据", "暂无数据"];
    } },
    loadMoreClass: { type: Array, default: function() {
      return ["gui-color-gray"];
    } },
    loadMoreFontSize: { type: String, default: "26rpx" },
    loadMoreStatus: { type: Number, default: 1 },
    apiLoadingStatus: { type: Boolean, default: false },
    reFreshTriggerHeight: { type: Number, default: 50 }
  },
  data() {
    return {
      pageStatus: false,
      footerHeight: 50,
      statusBarHeight: 44,
      headerHeight: 72,
      headerTapNumber: 0,
      fixedTop: 0,
      loadMoreTimer: null,
      fixedTopMargin: 0,
      scrollTop: 0,
      srcollTimer: null,
      refreshing: false,
      pullingdownVal: 0,
      topTagID: "no"
    };
  },
  watch: {
    isLoading: function(val) {
      if (val) {
        this.pageLoadingOpen();
      } else {
        this.pageLoadingClose();
      }
    }
  },
  mounted: function() {
    if (this.isLoading) {
      this.pageLoadingOpen();
    }
    try {
      var system = common_vendor.index.getSystemInfoSync();
      if (system.model) {
        this.statusBarHeight = system.statusBarHeight;
      }
    } catch (e) {
      return null;
    }
    if (this.customFooter) {
      setTimeout(() => {
        this.getDomSize("guiPageFooter", (res) => {
          this.footerHeight = res.height;
        }, 0);
      }, 200);
    }
    if (this.customHeader) {
      setTimeout(() => {
        this.getDomSize("guiPageHeader", (res) => {
          this.headerHeight = res.height;
          this.$nextTick(() => {
            this.pageStatus = true;
          });
        }, 0);
      }, 200);
    } else {
      this.pageStatus = true;
    }
    if (this.customHeader) {
      setTimeout(() => {
        this.getDomSize("guiPageHeader", (res) => {
          this.fixedTop = res.height;
        }, 0);
      }, 200);
    }
    setTimeout(() => {
      this.getDomSize("guiPageFixedTop", (res) => {
        this.fixedTopMargin = res.height;
      }, 0);
    }, 200);
  },
  methods: {
    onpullingdown: function(e) {
      if (this.apiLoadingStatus) {
        return false;
      }
      e.changedTouches = [{ pageY: e.pullingDistance }];
      this.$refs.guiPageRefresh.touchmove(e);
    },
    onrefresh: function() {
      if (this.apiLoadingStatus) {
        return false;
      }
      this.refreshing = true;
      this.$refs.guiPageRefresh.refreshStatus = 2;
      setTimeout(() => {
        this.$refs.guiPageRefresh.rotate360();
      }, 200);
      this.$emit("reload");
    },
    pageLoadingOpen: function() {
      this.getRefs("guipageloading", 0, (ref) => {
        ref.open();
      });
    },
    pageLoadingClose: function() {
      this.getRefs("guipageloading", 0, (ref) => {
        ref.close();
      });
    },
    // 下拉刷新相关
    touchstart: function(e) {
      if (!this.refresh) {
        return false;
      }
      if (this.apiLoadingStatus) {
        return false;
      }
      this.$refs.guiPageRefresh.touchstart(e);
    },
    touchmove: function(e) {
      if (!this.refresh) {
        return false;
      }
      if (this.apiLoadingStatus) {
        return false;
      }
      this.$refs.guiPageRefresh.touchmove(e);
    },
    touchend: function(e) {
      if (!this.refresh) {
        return false;
      }
      if (this.apiLoadingStatus) {
        return false;
      }
      this.$refs.guiPageRefresh.touchend(e);
    },
    scroll: function(e) {
      if (this.srcollTimer != null) {
        clearTimeout(this.srcollTimer);
      }
      this.srcollTimer = setTimeout(() => {
        this.$refs.guiPageRefresh.scroll(e);
        this.$emit("scroll", e);
        this.scrollTop = e.detail.scrollTop;
      }, 500);
    },
    toTop: function() {
      this.topTagID = "guiPageBodyTopTag";
      setTimeout(() => {
        this.topTagID = "no";
      }, 500);
    },
    endReload: function() {
      this.$refs.guiPageRefresh.endReload();
      this.refreshing = false;
    },
    reload: function() {
      if (this.apiLoadingStatus) {
        return false;
      }
      this.$emit("reload");
      if (this.loadmore) {
        this.$refs.guipageloadmore.stoploadmore();
      }
    },
    // 获取元素尺寸
    getDomSize: function(domIDOrRef, fun, count) {
      if (!count) {
        count = 1;
      }
      if (count >= 50) {
        fun({ width: 0, height: 0 });
        return false;
      }
      common_vendor.index.createSelectorQuery().in(this).select("#" + domIDOrRef).boundingClientRect().exec((res) => {
        if (res[0] == null) {
          count += 1;
          setTimeout(() => {
            this.getDomSize(domIDOrRef, fun, count);
          }, 50);
          return;
        } else {
          if (res[0].height == void 0) {
            count += 1;
            setTimeout(() => {
              this.getDomSize(domIDOrRef, fun, count);
            }, 50);
            return;
          }
          fun(res[0]);
          return;
        }
      });
    },
    stopfun: function(e) {
      e.stopPropagation();
      return null;
    },
    headerTap: function() {
      this.headerTapNumber++;
      if (this.headerTapNumber >= 2) {
        this.$emit("gotoTop");
        this.headerTapNumber = 0;
      } else {
        setTimeout(() => {
          this.headerTapNumber = 0;
        }, 1e3);
      }
    },
    getRefs: function(ref, count, fun) {
      if (count >= 50) {
        fun(this.$refs[ref]);
        return false;
      }
      var refReturn = this.$refs[ref];
      if (refReturn) {
        fun(refReturn);
      } else {
        count++;
        setTimeout(() => {
          this.getRefs(ref, count, fun);
        }, 100);
      }
    },
    loadmorefun: function() {
      if (!this.loadmore) {
        return false;
      }
      if (this.apiLoadingStatus) {
        return false;
      }
      if (this.loadMoreTimer != null) {
        clearTimeout(this.loadMoreTimer);
      }
      this.loadMoreTimer = setTimeout(() => {
        var status = this.$refs.guipageloadmore.loadMoreStatus;
        if (status != 0) {
          return null;
        }
        this.$refs.guipageloadmore.loading();
        this.$emit("loadmorefun");
      }, 80);
    },
    stopLoadmore: function() {
      this.$refs.guipageloadmore.stoploadmore();
    },
    stoploadmore: function() {
      this.$refs.guipageloadmore.stoploadmore();
    },
    nomore: function() {
      this.$refs.guipageloadmore.nomore();
    },
    toast: function(msg) {
      common_vendor.index.showToast({
        title: msg,
        icon: "none"
      });
    },
    resetFooterHeight: function() {
      if (this.customFooter) {
        setTimeout(() => {
          this.getDomSize("guiPageFooter", (res) => {
            this.footerHeight = res.height;
          }, 0);
        }, 500);
      }
    }
  },
  emits: ["scroll", "reload", "loadmorefun", "gotoTop"]
};
if (!Array) {
  const _easycom_gui_refresh2 = common_vendor.resolveComponent("gui-refresh");
  const _easycom_gui_loadmore2 = common_vendor.resolveComponent("gui-loadmore");
  const _easycom_gui_iphone_bottom2 = common_vendor.resolveComponent("gui-iphone-bottom");
  const _easycom_gui_page_loading2 = common_vendor.resolveComponent("gui-page-loading");
  (_easycom_gui_refresh2 + _easycom_gui_loadmore2 + _easycom_gui_iphone_bottom2 + _easycom_gui_page_loading2)();
}
const _easycom_gui_refresh = () => "./gui-refresh.js";
const _easycom_gui_loadmore = () => "./gui-loadmore.js";
const _easycom_gui_iphone_bottom = () => "./gui-iphone-bottom.js";
const _easycom_gui_page_loading = () => "./gui-page-loading.js";
if (!Math) {
  (_easycom_gui_refresh + _easycom_gui_loadmore + _easycom_gui_iphone_bottom + _easycom_gui_page_loading)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.customHeader
  }, $props.customHeader ? {
    b: common_vendor.n($props.statusBarClass),
    c: $data.statusBarHeight + "px",
    d: common_vendor.o((...args) => $options.headerTap && $options.headerTap(...args)),
    e: common_vendor.n($props.headerClass)
  } : {}, {
    f: $props.customHeader && $props.isHeaderSized
  }, $props.customHeader && $props.isHeaderSized ? {
    g: $data.headerHeight + "px"
  } : {}, {
    h: !$props.refresh && !$props.loadmore
  }, !$props.refresh && !$props.loadmore ? {
    i: common_vendor.n($props.fullPage ? "gui-flex1" : "")
  } : {}, {
    j: $props.refresh || $props.loadmore
  }, $props.refresh || $props.loadmore ? common_vendor.e({
    k: common_vendor.sr("guiPageRefresh", "5f67e70f-0"),
    l: common_vendor.o($options.reload),
    m: common_vendor.p({
      refreshText: $props.refreshText,
      customClass: $props.refreshClasses,
      triggerHeight: $props.reFreshTriggerHeight,
      refreshFontSize: $props.refreshFontSize
    }),
    n: $props.loadmore
  }, $props.loadmore ? {
    o: common_vendor.sr("guipageloadmore", "5f67e70f-1"),
    p: common_vendor.p({
      status: $props.loadMoreStatus,
      loadMoreText: $props.loadMoreText,
      customClass: $props.loadMoreClass,
      loadMoreFontSize: $props.loadMoreFontSize
    })
  } : {}, {
    q: common_vendor.o((...args) => $options.touchstart && $options.touchstart(...args)),
    r: common_vendor.o((...args) => $options.touchmove && $options.touchmove(...args)),
    s: common_vendor.o((...args) => $options.touchend && $options.touchend(...args)),
    t: common_vendor.o((...args) => $options.scroll && $options.scroll(...args)),
    v: $data.topTagID,
    w: common_vendor.o((...args) => $options.loadmorefun && $options.loadmorefun(...args)),
    x: $data.fixedTopMargin + "px"
  }) : {}, {
    y: $props.customFooter
  }, $props.customFooter ? {
    z: $data.footerHeight + "px"
  } : {}, {
    A: $props.customFooter
  }, $props.customFooter ? {
    B: common_vendor.p({
      need: !$props.isSwitchPage,
      customClass: $props.footerSpaceClass
    }),
    C: common_vendor.n($props.footerClass)
  } : {}, {
    D: common_vendor.n($props.pendantClass),
    E: $data.fixedTop + "px",
    F: common_vendor.sr("guipageloading", "5f67e70f-3"),
    G: $data.pageStatus ? 1 : 0,
    H: common_vendor.n($props.fullPage || $props.refresh || $props.loadmore ? "gui-flex1" : "")
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/Grace6/components/gui-page.vue"]]);
wx.createComponent(Component);
