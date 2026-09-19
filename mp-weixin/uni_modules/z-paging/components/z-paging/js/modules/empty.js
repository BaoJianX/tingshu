"use strict";
const uni_modules_zPaging_components_zPaging_js_zPagingUtils = require("../z-paging-utils.js");
const emptyModule = {
  props: {
    //是否强制隐藏空数据图，默认为否
    hideEmptyView: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("hideEmptyView", false)
    },
    //空数据图描述文字，默认为“没有数据哦~”
    emptyViewText: {
      type: [String, Object],
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("emptyViewText", null)
    },
    //是否显示空数据图重新加载按钮(无数据时)，默认为否
    showEmptyViewReload: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("showEmptyViewReload", false)
    },
    //加载失败时是否显示空数据图重新加载按钮，默认为是
    showEmptyViewReloadWhenError: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("showEmptyViewReloadWhenError", true)
    },
    //空数据图点击重新加载文字，默认为“重新加载”
    emptyViewReloadText: {
      type: [String, Object],
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("emptyViewReloadText", null)
    },
    //空数据图图片，默认使用z-paging内置的图片
    emptyViewImg: {
      type: String,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("emptyViewImg", "")
    },
    //空数据图“加载失败”描述文字，默认为“很抱歉，加载失败”
    emptyViewErrorText: {
      type: [String, Object],
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("emptyViewErrorText", null)
    },
    //空数据图“加载失败”图片，默认使用z-paging内置的图片
    emptyViewErrorImg: {
      type: String,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("emptyViewErrorImg", "")
    },
    //空数据图样式
    emptyViewStyle: {
      type: Object,
      default: function() {
        return uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("emptyViewStyle", {});
      }
    },
    //空数据图容器样式
    emptyViewSuperStyle: {
      type: Object,
      default: function() {
        return uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("emptyViewSuperStyle", {});
      }
    },
    //空数据图img样式
    emptyViewImgStyle: {
      type: Object,
      default: function() {
        return uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("emptyViewImgStyle", {});
      }
    },
    //空数据图描述文字样式
    emptyViewTitleStyle: {
      type: Object,
      default: function() {
        return uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("emptyViewTitleStyle", {});
      }
    },
    //空数据图重新加载按钮样式
    emptyViewReloadStyle: {
      type: Object,
      default: function() {
        return uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("emptyViewReloadStyle", {});
      }
    },
    //空数据图片是否铺满z-paging，默认为否，即填充满z-paging内列表(滚动区域)部分。若设置为否，则为填铺满整个z-paging
    emptyViewFixed: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("emptyViewFixed", false)
    },
    //空数据图片是否垂直居中，默认为是，若设置为否即为从空数据容器顶部开始显示。emptyViewFixed为false时有效
    emptyViewCenter: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("emptyViewCenter", true)
    },
    //加载中时是否自动隐藏空数据图，默认为是
    autoHideEmptyViewWhenLoading: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("autoHideEmptyViewWhenLoading", true)
    },
    //用户下拉列表触发下拉刷新加载中时是否自动隐藏空数据图，默认为是
    autoHideEmptyViewWhenPull: {
      type: Boolean,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("autoHideEmptyViewWhenPull", true)
    },
    //空数据view的z-index，默认为9
    emptyViewZIndex: {
      type: Number,
      default: uni_modules_zPaging_components_zPaging_js_zPagingUtils.u.gc("emptyViewZIndex", 9)
    }
  },
  computed: {
    finalEmptyViewImg() {
      return this.isLoadFailed ? this.emptyViewErrorImg : this.emptyViewImg;
    },
    finalShowEmptyViewReload() {
      return this.isLoadFailed ? this.showEmptyViewReloadWhenError : this.showEmptyViewReload;
    },
    showEmpty() {
      if (this.refresherOnly || this.hideEmptyView || this.realTotalData.length)
        return false;
      if (this.autoHideEmptyViewWhenLoading) {
        if (this.isAddedData && !this.firstPageLoaded && !this.loading)
          return true;
      } else {
        return true;
      }
      return !this.autoHideEmptyViewWhenPull && !this.isUserReload;
    }
  },
  methods: {
    //点击了空数据view重新加载按钮
    _emptyViewReload() {
      let callbacked = false;
      this.$emit("emptyViewReload", (reload) => {
        if (reload === void 0 || reload === true) {
          this.fromEmptyViewReload = true;
          this.reload();
        }
        callbacked = true;
      });
      this.$nextTick(() => {
        if (!callbacked) {
          this.fromEmptyViewReload = true;
          this.reload();
        }
      });
    },
    //点击了空数据view
    _emptyViewClick() {
      this.$emit("emptyViewClick");
    }
  }
};
exports.emptyModule = emptyModule;
