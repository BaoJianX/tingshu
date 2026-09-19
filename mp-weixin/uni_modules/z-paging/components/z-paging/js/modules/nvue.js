"use strict";
const common_vendor = require("../../../../../../common/vendor.js");
const nvueModule = {
  props: {},
  data() {
    return {
      nRefresherLoading: false,
      nListIsDragging: false,
      nShowBottom: true,
      nFixFreezing: false,
      nShowRefresherReveal: false,
      nIsFirstPageAndNoMore: false,
      nFirstPageAndNoMoreChecked: false,
      nLoadingMoreFixedHeight: false,
      nShowRefresherRevealHeight: 0,
      nOldShowRefresherRevealHeight: -1,
      nRefresherWidth: common_vendor.index.upx2px(750)
    };
  },
  watch: {
    nIsFirstPageAndNoMore: {
      handler(newVal) {
        const cellStyle = !this.useChatRecordMode || newVal ? {} : { transform: "rotate(180deg)" };
        this.$emit("update:cellStyle", cellStyle);
        this.$emit("cellStyleChange", cellStyle);
      },
      immediate: true
    }
  },
  computed: {},
  mounted() {
  },
  methods: {}
};
exports.nvueModule = nvueModule;
