"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  props: {
    src: {
      type: String,
      default: ""
    },
    cloudType: {
      type: String,
      default: "oss"
    }
  },
  data() {
    return {
      imgSrc: ""
    };
  },
  mounted() {
    this.setCloudFunction();
  },
  methods: {
    imgerror(even) {
      this.imgSrc = `https://mp-61599c79-d7ee-4a75-a24b-e5a288da6dd3.cdn.bspapp.com/cloudstorage/887c60f0-27f8-46d1-8769-2c45be0f3d7d.png`;
    },
    setCloudFunction() {
      switch (this.cloudType) {
        case "oss":
          this.imgSrc = this.src + "?x-oss-process=video/snapshot,t_0,f_jpg";
          break;
        case "process":
          this.imgSrc = this.src + "?ci-process=snapshot&time=0.01";
          break;
        case "vframe":
          this.imgSrc = this.src + "?vframe/jpg/offset/0";
          break;
        default:
          this.imgSrc = this.src;
          break;
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.imgSrc,
    b: common_vendor.o((...args) => $options.imgerror && $options.imgerror(...args))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e2a09413"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/uni_modules/cl-upload/components/cl-image/cl-image.vue"]]);
wx.createComponent(Component);
