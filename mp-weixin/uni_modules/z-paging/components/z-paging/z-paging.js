"use strict";
const uni_modules_zPaging_components_zPaging_js_zPagingMain = require("./js/z-paging-main.js");
const common_vendor = require("../../../../common/vendor.js");
require("./js/z-paging-static.js");
require("./js/z-paging-constant.js");
require("./js/z-paging-utils.js");
require("./js/z-paging-config.js");
require("./config/index.js");
require("./js/modules/common-layout.js");
require("./js/modules/data-handle.js");
require("./js/z-paging-enum.js");
require("./js/z-paging-interceptor.js");
require("./js/modules/i18n.js");
require("./i18n/index.js");
require("./js/modules/nvue.js");
require("./js/modules/empty.js");
require("./js/modules/refresher.js");
require("./js/modules/load-more.js");
require("./js/modules/loading.js");
require("./js/modules/scroller.js");
require("./js/modules/back-to-top.js");
require("./js/modules/virtual-list.js");
const block0 = (Component2) => {
  if (!Component2.wxsCallMethods) {
    Component2.wxsCallMethods = [];
  }
  Component2.wxsCallMethods.push("_handleListTouchstart", "_handleRefresherTouchstart", "_handleTouchDirectionChange", "_handleScrollViewDisableBounce", "_handleWxsPullingDown", "_handleRefresherTouchmove", "_handleRefresherTouchend", "_handlePropUpdate", "_handleWxsPullingDownStatusChange");
};
const block1 = {};
if (!Array) {
  const _component_z_paging_refresh = common_vendor.resolveComponent("z-paging-refresh");
  const _component_z_paging_load_more = common_vendor.resolveComponent("z-paging-load-more");
  const _easycom_z_paging_empty_view2 = common_vendor.resolveComponent("z-paging-empty-view");
  (_component_z_paging_refresh + _component_z_paging_load_more + _easycom_z_paging_empty_view2)();
}
const _easycom_z_paging_empty_view = () => "../z-paging-empty-view/z-paging-empty-view.js";
if (!Math) {
  _easycom_z_paging_empty_view();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: _ctx.cssSafeAreaInsetBottom === -1
  }, _ctx.cssSafeAreaInsetBottom === -1 ? {} : {}, {
    b: !_ctx.usePageScroll && _ctx.zSlots.top
  }, !_ctx.usePageScroll && _ctx.zSlots.top ? {} : _ctx.usePageScroll && _ctx.zSlots.top ? {
    d: common_vendor.s({
      "top": `${_ctx.windowTop}px`,
      "z-index": _ctx.topZIndex
    })
  } : {}, {
    c: _ctx.usePageScroll && _ctx.zSlots.top,
    e: _ctx.zSlots.left
  }, _ctx.zSlots.left ? {
    f: _ctx.finalIsOldWebView ? 1 : ""
  } : {}, {
    g: _ctx.finalRefresherFixedBacHeight > 0
  }, _ctx.finalRefresherFixedBacHeight > 0 ? {
    h: common_vendor.s({
      "background": _ctx.refresherFixedBackground,
      "height": `${_ctx.finalRefresherFixedBacHeight}px`
    })
  } : {}, {
    i: _ctx.showRefresher
  }, _ctx.showRefresher ? common_vendor.e({
    j: !(_ctx.zSlots.refresherComplete && _ctx.refresherStatus === _ctx.R.Complete)
  }, !(_ctx.zSlots.refresherComplete && _ctx.refresherStatus === _ctx.R.Complete) ? {
    k: common_vendor.r("refresher", {
      refresherStatus: _ctx.refresherStatus
    })
  } : {}, {
    l: _ctx.zSlots.refresherComplete && _ctx.refresherStatus === _ctx.R.Complete
  }, _ctx.zSlots.refresherComplete && _ctx.refresherStatus === _ctx.R.Complete ? {} : !_ctx.showCustomRefresher ? {
    n: common_vendor.sr("refresh", "1aa372d7-0"),
    o: common_vendor.s({
      "height": `${_ctx.finalRefresherThreshold}px`
    }),
    p: common_vendor.p({
      status: _ctx.refresherStatus,
      defaultThemeStyle: _ctx.finalRefresherThemeStyle,
      defaultText: _ctx.finalRefresherDefaultText,
      pullingText: _ctx.finalRefresherPullingText,
      refreshingText: _ctx.finalRefresherRefreshingText,
      completeText: _ctx.finalRefresherCompleteText,
      defaultImg: _ctx.refresherDefaultImg,
      pullingImg: _ctx.refresherPullingImg,
      refreshingImg: _ctx.refresherRefreshingImg,
      completeImg: _ctx.refresherCompleteImg,
      showUpdateTime: _ctx.showRefresherUpdateTime,
      updateTimeKey: _ctx.refresherUpdateTimeKey,
      updateTimeTextMap: _ctx.finalRefresherUpdateTimeTextMap,
      imgStyle: _ctx.refresherImgStyle,
      titleStyle: _ctx.refresherTitleStyle,
      updateTimeStyle: _ctx.refresherUpdateTimeStyle
    })
  } : {}, {
    m: !_ctx.showCustomRefresher,
    q: common_vendor.s({
      "height": `${_ctx.finalRefresherThreshold}px`,
      "background": _ctx.refresherBackground
    }),
    r: common_vendor.s({
      "margin-top": `-${_ctx.finalRefresherThreshold}px`,
      "background": _ctx.refresherBackground,
      "opacity": _ctx.isTouchmoving ? 1 : 0
    })
  }) : {}, {
    s: _ctx.useChatRecordMode && _ctx.zSlots.chatLoading && _ctx.loadingStatus !== _ctx.M.NoMore && _ctx.realTotalData.length
  }, _ctx.useChatRecordMode && _ctx.zSlots.chatLoading && _ctx.loadingStatus !== _ctx.M.NoMore && _ctx.realTotalData.length ? {} : _ctx.useChatRecordMode && _ctx.loadingStatus !== _ctx.M.NoMore && _ctx.realTotalData.length ? common_vendor.e({
    v: _ctx.loadingStatus !== _ctx.M.Loading
  }, _ctx.loadingStatus !== _ctx.M.Loading ? {
    w: common_vendor.t(_ctx.chatRecordLoadingMoreText),
    x: common_vendor.o((...args) => _ctx._onScrollToUpper && _ctx._onScrollToUpper(...args)),
    y: common_vendor.n(_ctx.defaultThemeStyle === "white" ? "zp-loading-more-text zp-loading-more-text-white" : "zp-loading-more-text zp-loading-more-text-black")
  } : {
    z: _ctx.base64Flower
  }) : {}, {
    t: _ctx.useChatRecordMode && _ctx.loadingStatus !== _ctx.M.NoMore && _ctx.realTotalData.length,
    A: _ctx.showLoading && _ctx.zSlots.loading && !_ctx.loadingFullFixed
  }, _ctx.showLoading && _ctx.zSlots.loading && !_ctx.loadingFullFixed ? {} : {}, {
    B: _ctx.finalUseInnerList
  }, _ctx.finalUseInnerList ? common_vendor.e({
    C: _ctx.finalUseVirtualList
  }, _ctx.finalUseVirtualList ? {
    D: common_vendor.f(_ctx.virtualList, (item, index, i0) => {
      return common_vendor.e(_ctx.useCompatibilityMode ? {} : {
        a: "cell-" + i0,
        b: common_vendor.r("cell", {
          item,
          index: _ctx.virtualTopRangeIndex + index
        }, i0)
      }, {
        c: `zp-id-${item["zp_index"]}`,
        d: item["zp_unique_index"],
        e: common_vendor.o(($event) => _ctx._innerCellClick(item, _ctx.virtualTopRangeIndex + index), item["zp_unique_index"])
      });
    }),
    E: _ctx.useCompatibilityMode,
    F: common_vendor.s(_ctx.innerCellStyle)
  } : {
    G: common_vendor.f(_ctx.realTotalData, (item, index, i0) => {
      return {
        a: "cell-" + i0,
        b: common_vendor.r("cell", {
          item,
          index
        }, i0),
        c: index,
        d: common_vendor.o(($event) => _ctx._innerCellClick(item, index), index)
      };
    })
  }, {
    H: common_vendor.s(_ctx.innerListStyle)
  }) : {}, {
    I: _ctx.useVirtualList
  }, _ctx.useVirtualList ? {
    J: common_vendor.s({
      height: _ctx.virtualPlaceholderBottomHeight + "px"
    })
  } : {}, {
    K: _ctx.showLoadingMoreDefault
  }, _ctx.showLoadingMoreDefault ? {} : _ctx.showLoadingMoreLoading ? {} : _ctx.showLoadingMoreNoMore ? {} : _ctx.showLoadingMoreFail ? {} : _ctx.showLoadingMoreCustom ? {
    P: common_vendor.o(($event) => _ctx._onLoadingMore("click")),
    Q: common_vendor.p({
      zConfig: _ctx.zLoadMoreConfig
    })
  } : {}, {
    L: _ctx.showLoadingMoreLoading,
    M: _ctx.showLoadingMoreNoMore,
    N: _ctx.showLoadingMoreFail,
    O: _ctx.showLoadingMoreCustom,
    R: _ctx.safeAreaInsetBottom && _ctx.useSafeAreaPlaceholder
  }, _ctx.safeAreaInsetBottom && _ctx.useSafeAreaPlaceholder ? {
    S: common_vendor.s({
      height: _ctx.safeAreaBottom + "px"
    })
  } : {}, {
    T: common_vendor.s({
      transform: _ctx.virtualPlaceholderTopHeight > 0 ? `translateY(${_ctx.virtualPlaceholderTopHeight}px)` : "none"
    }),
    U: common_vendor.s(_ctx.finalPagingContentStyle),
    V: _ctx.showEmpty
  }, _ctx.showEmpty ? common_vendor.e({
    W: _ctx.zSlots.empty
  }, _ctx.zSlots.empty ? {
    X: common_vendor.r("empty", {
      isLoadFailed: _ctx.isLoadFailed
    })
  } : {
    Y: common_vendor.o(_ctx._emptyViewReload),
    Z: common_vendor.o(_ctx._emptyViewClick),
    aa: common_vendor.p({
      emptyViewImg: _ctx.finalEmptyViewImg,
      emptyViewText: _ctx.finalEmptyViewText,
      showEmptyViewReload: _ctx.finalShowEmptyViewReload,
      emptyViewReloadText: _ctx.finalEmptyViewReloadText,
      isLoadFailed: _ctx.isLoadFailed,
      emptyViewStyle: _ctx.emptyViewStyle,
      emptyViewTitleStyle: _ctx.emptyViewTitleStyle,
      emptyViewImgStyle: _ctx.emptyViewImgStyle,
      emptyViewReloadStyle: _ctx.emptyViewReloadStyle,
      emptyViewZIndex: _ctx.emptyViewZIndex,
      emptyViewFixed: _ctx.emptyViewFixed
    })
  }, {
    ab: _ctx.emptyViewCenter ? 1 : "",
    ac: common_vendor.s({
      emptyViewSuperStyle: _ctx.emptyViewSuperStyle
    })
  }) : {}, {
    ad: common_vendor.s(_ctx.scrollViewInStyle),
    ae: common_vendor.s({
      "transform": _ctx.finalRefresherTransform,
      "transition": _ctx.refresherTransition
    }),
    af: _ctx.wxsPropType,
    ag: _ctx.finalRefresherThreshold,
    ah: _ctx.isIos,
    ai: _ctx.loading || _ctx.isRefresherInComplete,
    aj: _ctx.useChatRecordMode,
    ak: _ctx.refresherEnabled,
    al: _ctx.useCustomRefresher,
    am: _ctx.wxsPageScrollTop,
    an: _ctx.wxsScrollTop,
    ao: _ctx.refresherMaxAngle,
    ap: _ctx.refresherAngleEnableChangeContinued,
    aq: _ctx.usePageScroll,
    ar: _ctx.watchTouchDirectionChange,
    as: _ctx.isTouchmoving,
    at: _ctx.finalRefresherOutRate,
    av: _ctx.finalRefresherPullRate,
    aw: _ctx.hasTouchmove,
    ax: !_ctx.usePageScroll ? 1 : "",
    ay: !_ctx.showScrollbar ? 1 : "",
    az: _ctx.scrollTop,
    aA: _ctx.scrollX,
    aB: _ctx.scrollable && !_ctx.usePageScroll && _ctx.scrollEnable && (_ctx.refresherCompleteScrollable ? true : _ctx.refresherStatus !== _ctx.R.Complete),
    aC: _ctx.finalEnableBackToTop,
    aD: _ctx.showScrollbar,
    aE: _ctx.finalScrollWithAnimation,
    aF: _ctx.scrollIntoView,
    aG: _ctx.finalLowerThreshold,
    aH: _ctx.finalRefresherEnabled && !_ctx.useCustomRefresher,
    aI: _ctx.finalRefresherThreshold,
    aJ: _ctx.finalRefresherDefaultStyle,
    aK: _ctx.refresherBackground,
    aL: _ctx.finalRefresherTriggered,
    aM: common_vendor.o((...args) => _ctx._scroll && _ctx._scroll(...args)),
    aN: common_vendor.o((...args) => _ctx._onScrollToLower && _ctx._onScrollToLower(...args)),
    aO: common_vendor.o((...args) => _ctx._onScrollToUpper && _ctx._onScrollToUpper(...args)),
    aP: common_vendor.o((...args) => _ctx._onRestore && _ctx._onRestore(...args)),
    aQ: common_vendor.o(($event) => _ctx._onRefresh(true)),
    aR: _ctx.finalIsOldWebView ? 1 : "",
    aS: common_vendor.s(_ctx.scrollViewContainerStyle),
    aT: _ctx.zSlots.right
  }, _ctx.zSlots.right ? {
    aU: _ctx.finalIsOldWebView ? 1 : ""
  } : {}, {
    aV: !_ctx.usePageScroll ? 1 : "",
    aW: common_vendor.s(_ctx.finalScrollViewStyle),
    aX: !_ctx.usePageScroll && _ctx.zSlots.bottom
  }, !_ctx.usePageScroll && _ctx.zSlots.bottom ? {} : _ctx.usePageScroll && _ctx.zSlots.bottom ? {
    aZ: common_vendor.s({
      "bottom": `${_ctx.windowBottom}px`
    })
  } : {}, {
    aY: _ctx.usePageScroll && _ctx.zSlots.bottom,
    ba: _ctx.showBackToTopClass
  }, _ctx.showBackToTopClass ? common_vendor.e({
    bb: _ctx.zSlots.backToTop
  }, _ctx.zSlots.backToTop ? {} : {
    bc: _ctx.backToTopImg.length ? _ctx.backToTopImg : _ctx.base64BackToTop
  }, {
    bd: common_vendor.n(_ctx.backToTopClass),
    be: common_vendor.s(_ctx.finalBackToTopStyle),
    bf: common_vendor.o((...args) => _ctx._backToTopClick && _ctx._backToTopClick(...args))
  }) : {}, {
    bg: _ctx.showLoading && _ctx.zSlots.loading && _ctx.loadingFullFixed
  }, _ctx.showLoading && _ctx.zSlots.loading && _ctx.loadingFullFixed ? {} : {}, {
    bh: !_ctx.usePageScroll && _ctx.fixed ? 1 : "",
    bi: _ctx.usePageScroll ? 1 : "",
    bj: _ctx.renderPropScrollTop < 1 ? 1 : "",
    bk: common_vendor.s(_ctx.finalPagingStyle)
  });
}
if (typeof block0 === "function")
  block0(uni_modules_zPaging_components_zPaging_js_zPagingMain._sfc_main);
if (typeof block1 === "function")
  block1(uni_modules_zPaging_components_zPaging_js_zPagingMain._sfc_main);
const Component = /* @__PURE__ */ common_vendor._export_sfc(uni_modules_zPaging_components_zPaging_js_zPagingMain._sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1aa372d7"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/uni_modules/z-paging/components/z-paging/z-paging.vue"]]);
wx.createComponent(Component);
