"use strict";
const common_vendor = require("../../../../../../common/vendor.js");
const uni_modules_zPaging_components_zPaging_i18n_index = require("../../i18n/index.js");
const uni_modules_zPaging_components_zPaging_js_zPagingInterceptor = require("../z-paging-interceptor.js");
const { t } = common_vendor.initVueI18n(uni_modules_zPaging_components_zPaging_i18n_index.messages);
const i18nModule = {
  data() {
    return {
      language: common_vendor.index.getSystemInfoSync().language
    };
  },
  computed: {
    finalLanguage() {
      try {
        const local = common_vendor.index.getLocale();
        const language = this.language;
        return local === "auto" ? uni_modules_zPaging_components_zPaging_js_zPagingInterceptor.interceptor._handleLanguage2Local(language, this._language2Local(language)) : local;
      } catch (e) {
        return "zh-Hans";
      }
    },
    finalRefresherDefaultText() {
      return this._getI18nText("zp.refresher.default", this.refresherDefaultText);
    },
    finalRefresherPullingText() {
      return this._getI18nText("zp.refresher.pulling", this.refresherPullingText);
    },
    finalRefresherRefreshingText() {
      return this._getI18nText("zp.refresher.refreshing", this.refresherRefreshingText);
    },
    finalRefresherCompleteText() {
      return this._getI18nText("zp.refresher.complete", this.refresherCompleteText);
    },
    finalRefresherUpdateTimeTextMap() {
      return {
        title: t("zp.refresherUpdateTime.title"),
        none: t("zp.refresherUpdateTime.none"),
        today: t("zp.refresherUpdateTime.today"),
        yesterday: t("zp.refresherUpdateTime.yesterday")
      };
    },
    finalLoadingMoreDefaultText() {
      return this._getI18nText("zp.loadingMore.default", this.loadingMoreDefaultText);
    },
    finalLoadingMoreLoadingText() {
      return this._getI18nText("zp.loadingMore.loading", this.loadingMoreLoadingText);
    },
    finalLoadingMoreNoMoreText() {
      return this._getI18nText("zp.loadingMore.noMore", this.loadingMoreNoMoreText);
    },
    finalLoadingMoreFailText() {
      return this._getI18nText("zp.loadingMore.fail", this.loadingMoreFailText);
    },
    finalEmptyViewText() {
      return this.isLoadFailed ? this.finalEmptyViewErrorText : this._getI18nText("zp.emptyView.title", this.emptyViewText);
    },
    finalEmptyViewReloadText() {
      return this._getI18nText("zp.emptyView.reload", this.emptyViewReloadText);
    },
    finalEmptyViewErrorText() {
      return this._getI18nText("zp.emptyView.error", this.emptyViewErrorText);
    },
    finalSystemLoadingText() {
      return this._getI18nText("zp.systemLoading.title", this.systemLoadingText);
    }
  },
  methods: {
    //获取当前z-paging的语言
    getLanguage() {
      return this.finalLanguage;
    },
    //获取国际化转换后的文本
    _getI18nText(key, value) {
      const dataType = Object.prototype.toString.call(value);
      if (dataType === "[object Object]") {
        const nextValue = value[this.finalLanguage];
        if (nextValue)
          return nextValue;
      } else if (dataType === "[object String]") {
        return value;
      }
      return t(key);
    },
    //系统language转i18n local
    _language2Local(language) {
      const formatedLanguage = language.toLowerCase().replace(new RegExp("_", ""), "-");
      if (formatedLanguage.indexOf("zh") !== -1) {
        if (formatedLanguage === "zh" || formatedLanguage === "zh-cn" || formatedLanguage.indexOf("zh-hans") !== -1) {
          return "zh-Hans";
        }
        return "zh-Hant";
      }
      if (formatedLanguage.indexOf("en") !== -1)
        return "en";
      return language;
    }
  }
};
exports.i18nModule = i18nModule;
