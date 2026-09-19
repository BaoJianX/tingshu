"use strict";
const common_vendor = require("../../../../../../common/vendor.js");
const commonLayoutModule = {
  data() {
    return {
      systemInfo: null,
      cssSafeAreaInsetBottom: -1
    };
  },
  computed: {
    windowTop() {
      var _a;
      return ((_a = this.systemInfo) == null ? void 0 : _a.windowTop) || 0;
    },
    safeAreaBottom() {
      if (!this.systemInfo)
        return 0;
      let safeAreaBottom = 0;
      safeAreaBottom = Math.max(this.cssSafeAreaInsetBottom, 0);
      return safeAreaBottom;
    },
    isOldWebView() {
      try {
        const systemInfos = systemInfo.system.split(" ");
        const deviceType = systemInfos[0];
        const version = parseInt(systemInfos[1]);
        if (deviceType === "iOS" && version <= 10 || deviceType === "Android" && version <= 6) {
          return true;
        }
      } catch (e) {
        return false;
      }
      return false;
    },
    zSlots() {
      return this.$slots;
    }
  },
  methods: {
    //获取节点尺寸
    _getNodeClientRect(select, inDom = true, scrollOffset = false) {
      let res = !!inDom ? common_vendor.index.createSelectorQuery().in(inDom === true ? this : inDom) : common_vendor.index.createSelectorQuery();
      scrollOffset ? res.select(select).scrollOffset() : res.select(select).boundingClientRect();
      return new Promise((resolve, reject) => {
        res.exec((data) => {
          resolve(data && data != "" && data != void 0 && data.length ? data : false);
        });
      });
    },
    //获取slot="left"和slot="right"宽度并且更新布局
    _updateLeftAndRightWidth(targetStyle, parentNodePrefix) {
      console.log("_updateLeftAndRightWidth");
      this.$nextTick(() => {
        let delayTime = 0;
        setTimeout(() => {
          ["left", "right"].map((position) => {
            this._getNodeClientRect(`.${parentNodePrefix}-${position}`).then((res) => {
              this.$set(targetStyle, position, res ? res[0].width + "px" : "0px");
            });
          });
        }, delayTime);
      });
    },
    //通过获取css设置的底部安全区域占位view高度设置bottom距离
    _getCssSafeAreaInsetBottom(success) {
      this._getNodeClientRect(".zp-safe-area-inset-bottom").then((res) => {
        this.cssSafeAreaInsetBottom = res ? res[0].height : -1;
        res && success && success();
      });
    }
  }
};
exports.commonLayoutModule = commonLayoutModule;
