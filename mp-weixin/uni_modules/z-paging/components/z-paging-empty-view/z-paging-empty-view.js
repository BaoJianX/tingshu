"use strict";
const uni_modules_zPaging_components_zPaging_js_zPagingStatic = require("../z-paging/js/z-paging-static.js");
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "z-paging-empty-view",
  data() {
    return {};
  },
  props: {
    //空数据描述文字
    emptyViewText: {
      type: String,
      default: "没有数据哦~"
    },
    //空数据图片
    emptyViewImg: {
      type: String,
      default: ""
    },
    //是否显示空数据图重新加载按钮
    showEmptyViewReload: {
      type: Boolean,
      default: false
    },
    //空数据点击重新加载文字
    emptyViewReloadText: {
      type: String,
      default: "重新加载"
    },
    //是否是加载失败
    isLoadFailed: {
      type: Boolean,
      default: false
    },
    //空数据图样式
    emptyViewStyle: {
      type: Object,
      default: function() {
        return {};
      }
    },
    //空数据图img样式
    emptyViewImgStyle: {
      type: Object,
      default: function() {
        return {};
      }
    },
    //空数据图描述文字样式
    emptyViewTitleStyle: {
      type: Object,
      default: function() {
        return {};
      }
    },
    //空数据图重新加载按钮样式
    emptyViewReloadStyle: {
      type: Object,
      default: function() {
        return {};
      }
    },
    //空数据图z-index
    emptyViewZIndex: {
      type: Number,
      default: 9
    },
    //空数据图片是否使用fixed布局并铺满z-paging
    emptyViewFixed: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    emptyImg() {
      return this.isLoadFailed ? uni_modules_zPaging_components_zPaging_js_zPagingStatic.zStatic.base64Error : uni_modules_zPaging_components_zPaging_js_zPagingStatic.zStatic.base64Empty;
    },
    finalEmptyViewStyle() {
      this.emptyViewStyle["z-index"] = this.emptyViewZIndex;
      return this.emptyViewStyle;
    }
  },
  methods: {
    reloadClick() {
      this.$emit("reload");
    },
    emptyViewClick() {
      this.$emit("viewClick");
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$props.emptyViewImg.length
  }, !$props.emptyViewImg.length ? {
    b: common_vendor.s($props.emptyViewImgStyle),
    c: $options.emptyImg
  } : {
    d: common_vendor.s($props.emptyViewImgStyle),
    e: $props.emptyViewImg
  }, {
    f: common_vendor.t($props.emptyViewText),
    g: common_vendor.s($props.emptyViewTitleStyle),
    h: $props.showEmptyViewReload
  }, $props.showEmptyViewReload ? {
    i: common_vendor.t($props.emptyViewReloadText),
    j: common_vendor.s($props.emptyViewReloadStyle),
    k: common_vendor.o((...args) => $options.reloadClick && $options.reloadClick(...args))
  } : {}, {
    l: $props.emptyViewFixed ? 1 : "",
    m: common_vendor.s($options.finalEmptyViewStyle),
    n: common_vendor.o((...args) => $options.emptyViewClick && $options.emptyViewClick(...args))
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-b7999e14"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/uni_modules/z-paging/components/z-paging-empty-view/z-paging-empty-view.vue"]]);
wx.createComponent(Component);
