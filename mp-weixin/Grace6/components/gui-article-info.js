"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "gui-article-info",
  props: {
    article: {
      type: Array,
      default: function() {
        return new Array();
      }
    },
    itemMargin: {
      type: String,
      default: "20rpx"
    },
    padding: {
      type: Number,
      default: 30
    },
    textClass: {
      type: Array,
      default: function() {
        return ["gui-article-text", "gui-primary-text"];
      }
    },
    centerClass: {
      type: Array,
      default: function() {
        return ["gui-article-center", "gui-primary-text"];
      }
    },
    imgRadius: {
      type: String,
      default: "6rpx"
    },
    quoteClass: {
      type: Array,
      default: function() {
        return ["gui-article-quote", "gui-primary-text", "gui-bg-gray", "gui-dark-bg-level-2"];
      }
    },
    strongClass: {
      type: Array,
      default: function() {
        return ["gui-article-strong", "gui-primary-text"];
      }
    },
    splineClass: {
      type: Array,
      default: function() {
        return ["gui-article-spline", "gui-color-gray"];
      }
    }
  },
  methods: {
    showImgs: function(e) {
      var currentUrl = e.currentTarget.dataset.url;
      var imgs = [];
      var items = this.article;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type == "img") {
          imgs.push(items[i].content);
        }
      }
      common_vendor.index.previewImage({
        urls: imgs,
        current: currentUrl
      });
    }
  }
};
if (!Array) {
  const _easycom_gui_image2 = common_vendor.resolveComponent("gui-image");
  const _easycom_gui_link2 = common_vendor.resolveComponent("gui-link");
  (_easycom_gui_image2 + _easycom_gui_link2)();
}
const _easycom_gui_image = () => "./gui-image.js";
const _easycom_gui_link = () => "./gui-link.js";
if (!Math) {
  (_easycom_gui_image + _easycom_gui_link)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($props.article, (item, index, i0) => {
      return common_vendor.e({
        a: item.type == "txt"
      }, item.type == "txt" ? {
        b: common_vendor.t(item.content),
        c: common_vendor.n($props.textClass)
      } : {}, {
        d: item.type == "center"
      }, item.type == "center" ? {
        e: common_vendor.t(item.content),
        f: common_vendor.n($props.centerClass)
      } : item.type == "img" ? {
        h: "2ce5e431-0-" + i0,
        i: common_vendor.p({
          src: item.content,
          height: 0,
          borderRadius: $props.imgRadius,
          width: 750 - $props.padding * 2
        }),
        j: item.content,
        k: common_vendor.o((...args) => $options.showImgs && $options.showImgs(...args), index)
      } : item.type == "quote" || item.type == "pre" ? {
        m: common_vendor.t(item.content),
        n: common_vendor.n($props.quoteClass)
      } : item.type == "strong" ? {
        p: common_vendor.t(item.content),
        q: common_vendor.n($props.strongClass)
      } : item.type == "link" ? {
        s: "2ce5e431-1-" + i0,
        t: common_vendor.p({
          url: item.content,
          title: item.content
        })
      } : item.type == "spline" ? {
        w: common_vendor.n($props.splineClass)
      } : item.type == "h1" ? {
        y: common_vendor.t(item.content)
      } : item.type == "h2" ? {
        A: common_vendor.t(item.content)
      } : item.type == "h3" ? {
        C: common_vendor.t(item.content)
      } : item.type == "h4" ? {
        E: common_vendor.t(item.content)
      } : item.type == "h5" ? {
        G: common_vendor.t(item.content)
      } : item.type == "h6" ? {
        I: common_vendor.t(item.content)
      } : {}, {
        g: item.type == "img",
        l: item.type == "quote" || item.type == "pre",
        o: item.type == "strong",
        r: item.type == "link",
        v: item.type == "spline",
        x: item.type == "h1",
        z: item.type == "h2",
        B: item.type == "h3",
        D: item.type == "h4",
        F: item.type == "h5",
        H: item.type == "h6",
        J: item.type == "video"
      }, item.type == "video" ? {
        K: 750 - $props.padding * 2 + "rpx",
        L: item.content
      } : {}, {
        M: index
      });
    }),
    b: $props.itemMargin,
    c: $props.padding + "rpx",
    d: $props.padding + "rpx"
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-2ce5e431"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/Grace6/components/gui-article-info.vue"]]);
wx.createComponent(Component);
