"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "gui-flex",
  data() {
    return {
      styleIn: "",
      classIn: []
    };
  },
  props: {
    // 自定义行内样式
    customStyle: {
      type: String,
      default: ""
    },
    // 自定义样式
    customClass: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // 点击样式
    hoverClass: {
      type: String,
      default: ""
    },
    // 主轴方向
    direction: {
      type: String,
      default: "column"
    },
    // 换行
    wrap: {
      type: Boolean,
      default: true
    },
    justifyContent: {
      type: String,
      default: ""
    },
    alignItems: {
      type: String,
      default: ""
    }
  },
  mounted: function() {
    this.initcustomClass();
  },
  watch: {
    wrap: function() {
      this.initcustomClass();
    },
    justifyContent: function() {
      this.initcustomClass();
    },
    alignItems: function() {
      this.initcustomClass();
    },
    customClass: function() {
      this.initcustomClass();
    },
    customStyle: function() {
      this.initcustomClass();
    }
  },
  methods: {
    initcustomClass: function() {
      let customClassData = ["gui-flex-box", "gui-flex"];
      if (this.direction == "column") {
        customClassData.push("gui-column");
      } else {
        customClassData.push("gui-row");
      }
      if (this.direction == "row") {
        if (this.wrap) {
          customClassData.push("gui-wrap");
        } else {
          customClassData.push("gui-nowrap");
        }
      }
      customClassData = customClassData.concat(this.customClass);
      this.classIn = customClassData;
      this.styleIn = "";
      this.styleIn += this.customStyle;
      if (this.justifyContent != "") {
        this.styleIn += "; justify-content:" + this.justifyContent + "; ";
      }
      if (this.alignItems != "") {
        this.styleIn += "align-items:" + this.alignItems + "; ";
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.n($data.classIn),
    b: $props.hoverClass,
    c: common_vendor.s($data.styleIn + "; ")
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/Grace6/components/gui-flex.vue"]]);
wx.createComponent(Component);
