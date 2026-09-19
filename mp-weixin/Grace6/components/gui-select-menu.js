"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "gui-select-menu",
  props: {
    items: {
      type: Array,
      default: function() {
        return [];
      }
    },
    selectIndex: { type: Number, default: 0 },
    isH5header: { type: Boolean, default: true },
    fontSize: { type: String, default: "28rpx" },
    zIndex: { type: Number, default: 299 },
    isInput: { type: Boolean, default: false },
    placeholder: { type: String, default: "请输入自定义条件" },
    addBtnName: { type: String, default: "+ 添加" },
    height: { type: String, default: "500rpx" },
    itemHeight: { type: String, default: "88rpx" },
    inputType: { type: String, default: "add" }
  },
  data() {
    return {
      currentIndex: 0,
      top: 0,
      showRes: [],
      inputVal: "",
      show: false,
      itemsIn: [],
      itemTo: ""
    };
  },
  watch: {
    selectIndex: function() {
      this.currentIndex = this.selectIndex;
    },
    items: function(val) {
      this.itemsIn = val;
    }
  },
  created: function() {
    this.currentIndex = this.selectIndex;
    this.itemsIn = this.items;
  },
  methods: {
    stopfun: function(e) {
      e.stopPropagation();
      return;
    },
    showMenu: function() {
      common_vendor.index.createSelectorQuery().in(this).select("#menuMain").fields({ rect: true }, (res) => {
        this.top = res.top - 1;
        this.show = true;
        this.$emit("showMenu");
      }).exec();
    },
    close: function() {
      setTimeout(() => {
        this.show = false;
      }, 100);
      this.$emit("close");
    },
    select: function(e) {
      var index = Number(e.currentTarget.dataset.index);
      this.currentIndex = index;
      this.$emit("select", index, this.items[index]);
      this.close();
    },
    addTag: function() {
      if (this.inputVal == "") {
        return;
      }
      if (this.inputType == "add") {
        var newArr = JSON.stringify(this.itemsIn);
        newArr = JSON.parse(newArr);
        newArr.unshift(this.inputVal);
        this.itemsIn = [];
        this.itemsIn = newArr;
        this.$emit("submit", this.inputVal);
        this.inputVal = "";
        this.currentIndex = 0;
        this.close();
      } else {
        this.search();
      }
    },
    getSize: function() {
      return this.itemsIn.length - 1;
    },
    setCurrentIndex: function(index) {
      this.currentIndex = index;
    },
    search: function() {
      var searchIndex = -1;
      for (var i = 0; i < this.itemsIn.length; i++) {
        if (this.itemsIn[i].indexOf(this.inputVal) != -1) {
          searchIndex = i;
          break;
        }
      }
      if (searchIndex != -1) {
        this.itemTo = "items" + searchIndex;
      }
    },
    inputting: function() {
      if (this.inputType == "search") {
        this.search();
      }
    }
  },
  emits: ["showMenu", "close", "select", "submit"]
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.show
  }, $data.show ? {
    b: common_vendor.o((...args) => $options.close && $options.close(...args)),
    c: common_vendor.o((...args) => $options.stopfun && $options.stopfun(...args)),
    d: $props.zIndex - 1
  } : {}, {
    e: common_vendor.t($data.itemsIn[$data.currentIndex]),
    f: $props.fontSize,
    g: !$data.show
  }, !$data.show ? {
    h: $props.fontSize
  } : {}, {
    i: $data.show
  }, $data.show ? {
    j: $props.fontSize
  } : {}, {
    k: common_vendor.o((...args) => $options.showMenu && $options.showMenu(...args)),
    l: $data.show
  }, $data.show ? common_vendor.e({
    m: $props.isInput
  }, $props.isInput ? common_vendor.e({
    n: common_vendor.o((...args) => $options.addTag && $options.addTag(...args)),
    o: common_vendor.o([($event) => $data.inputVal = $event.detail.value, (...args) => $options.inputting && $options.inputting(...args)]),
    p: $props.placeholder,
    q: $data.inputVal,
    r: $props.inputType == "add"
  }, $props.inputType == "add" ? {
    s: common_vendor.t($props.addBtnName),
    t: common_vendor.o((...args) => $options.addTag && $options.addTag(...args))
  } : $props.inputType == "search" ? {
    w: common_vendor.o((...args) => $options.addTag && $options.addTag(...args))
  } : {}, {
    v: $props.inputType == "search",
    x: common_vendor.o((...args) => $options.stopfun && $options.stopfun(...args))
  }) : {}, {
    y: common_vendor.f($data.itemsIn, (item, index, i0) => {
      return common_vendor.e({
        a: index == $data.currentIndex
      }, index == $data.currentIndex ? {
        b: $props.fontSize
      } : {}, {
        c: common_vendor.t(item),
        d: index,
        e: index,
        f: common_vendor.o((...args) => $options.select && $options.select(...args), index),
        g: "items" + index
      });
    }),
    z: $props.fontSize,
    A: $props.itemHeight,
    B: $props.height,
    C: $data.itemTo,
    D: $data.top + "px",
    E: $props.zIndex,
    F: common_vendor.o((...args) => $options.close && $options.close(...args)),
    G: common_vendor.o((...args) => $options.stopfun && $options.stopfun(...args))
  }) : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5b6f7438"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/Grace6/components/gui-select-menu.vue"]]);
wx.createComponent(Component);
