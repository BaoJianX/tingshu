"use strict";
const common_vendor = require("../../common/vendor.js");
const api_category_category = require("../../api/category/category.js");
require("../../stores/user.js");
const utils_utils = require("../../utils/utils.js");
const api_search_search = require("../../api/search/search.js");
require("../../utils/request.js");
require("../../config/confjg.js");
require("../../utils/constant.js");
require("../../api/user/user.js");
require("../../api/order/order.js");
if (!Array) {
  const _easycom_le_dropdown2 = common_vendor.resolveComponent("le-dropdown");
  _easycom_le_dropdown2();
}
const _easycom_le_dropdown = () => "../../uni_modules/le-dropdown/components/le-dropdown/le-dropdown.js";
if (!Math) {
  (SearchInput + _easycom_le_dropdown)();
}
const SearchInput = () => "../SearchInput/SearchInput.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "SearchTop",
  props: {
    queryParam: {
      type: Object,
      required: true,
      default: {}
    },
    handleSearch: {
      type: Function,
      required: true,
      default: () => {
      }
    },
    category1Id: {
      type: Number || String,
      default: 0
    },
    isNeedSearchInput: {
      type: Boolean,
      default: true
    }
  },
  setup(__props) {
    const props = __props;
    const checkedThemeColor = common_vendor.ref("#008AFF");
    const menuList = common_vendor.ref([
      {
        title: "综合排序",
        type: "click",
        value: "1:desc",
        // 自定义属性，用于满足type = click时候的互斥
        isChecked: false
      },
      {
        title: "播放量",
        type: "click",
        value: "2:desc",
        // 自定义属性，用于满足type = click时候的互斥
        isChecked: false
      },
      {
        title: "发布时间",
        type: "click",
        value: "3:desc",
        // 自定义属性，用于满足type = click时候的互斥
        isChecked: false
      }
    ]);
    const filterInfo = common_vendor.ref({
      title: "筛选",
      type: "filter",
      children: []
    });
    common_vendor.watch(menuList, (newVal) => {
      var _a, _b;
      let order = ((_a = menuList.value.find((item) => item.type === "click" && item.isChecked)) == null ? void 0 : _a.value) || null;
      let attributeListTarget = ((_b = menuList.value.find((item) => {
        var _a2;
        return item.type === "filter" && ((_a2 = item.children) == null ? void 0 : _a2.length);
      })) == null ? void 0 : _b.children) || [];
      attributeListTarget = attributeListTarget.filter((item) => item.value);
      let attributeList = attributeListTarget.map((item) => {
        let targetAttrObj = item.options.find((item2) => item.value === item2.value);
        return `${targetAttrObj == null ? void 0 : targetAttrObj.attributeId}:${targetAttrObj == null ? void 0 : targetAttrObj.value}`;
      });
      props.queryParam.order = order;
      props.queryParam.attributeList = attributeList;
    }, { deep: true });
    const searchSuggestionsList = common_vendor.ref([]);
    const searchHistoryList = common_vendor.ref([]);
    const getAttrListByCategoryId = async () => {
      try {
        const res = await api_category_category.courseService.getAttrList(props.category1Id);
        utils_utils.recursionTree(res.data, "label", "valueName", "attributeValueList");
        utils_utils.recursionTree(res.data, "value", "id", "attributeValueList");
        utils_utils.recursionTree(res.data, "title", "attributeName", "attributeValueList");
        utils_utils.recursionTree(res.data, "options", "attributeValueList");
        res.data.forEach((item) => {
          item.value = null;
          item.type = "radio";
          item.options.unshift({
            label: "全部",
            value: null
          });
        });
        filterInfo.value.children = res.data;
        console.log("filterInfo.value", filterInfo.value);
        if (filterInfo.value.children.length) {
          menuList.value.push(filterInfo.value);
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    const handleAddSearchHistoryItem = (item) => {
      if (!searchHistoryList.value.includes(item)) {
        searchHistoryList.value.push(item);
      }
      common_vendor.index.setStorageSync("searchHistoryList", JSON.stringify(searchHistoryList.value));
    };
    const handleClearSearchHistory = () => {
      searchHistoryList.value = [];
      common_vendor.index.setStorageSync("searchHistoryList", JSON.stringify(searchHistoryList.value));
    };
    const handleOffSearchSuggestions = () => {
      searchSuggestionsList.value = [];
    };
    const handleSearchSuggestItemOnClick = (item) => {
      console.log("handleSearchSuggestItemOnClick", item);
      props.queryParam.keyword = item;
      handleConfirm();
    };
    const handleConfirm = () => {
      var _a, _b;
      if ((_a = props.queryParam) == null ? void 0 : _a.keyword.trim()) {
        handleAddSearchHistoryItem((_b = props.queryParam) == null ? void 0 : _b.keyword.trim());
      }
      handleOffSearchSuggestions();
      props.handleSearch();
    };
    const handleBlur = () => {
      console.log("handleBlur");
      setTimeout(() => {
        handleOffSearchSuggestions();
      }, 600);
    };
    const getSearchSuggest = utils_utils.myThrottle(async (keyWord = props.queryParam.keyword) => {
      if (!keyWord.trim()) {
        handleOffSearchSuggestions();
        return;
      }
      console.log("getSearchSuggest", keyWord);
      try {
        const res = await api_search_search.search.getSearchSuggestions(keyWord);
        searchSuggestionsList.value = res.data || [];
      } catch (error) {
        console.log("error", error);
      }
    }, 500);
    const handleInputting = (value) => {
      console.log("handleInputting", value);
      props.queryParam.keyword = value;
      getSearchSuggest();
    };
    const handleClear = () => {
      props.queryParam.keyword = "";
      props.handleSearch();
    };
    common_vendor.onMounted(() => {
      searchHistoryList.value = common_vendor.index.getStorageSync("searchHistoryList") ? JSON.parse(common_vendor.index.getStorageSync("searchHistoryList")) : [];
      props.category1Id && getAttrListByCategoryId();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.isNeedSearchInput
      }, __props.isNeedSearchInput ? {
        b: common_vendor.sr("searchInputRef", "50145598-0"),
        c: common_vendor.o(handleBlur),
        d: common_vendor.o(handleClear),
        e: common_vendor.o(handleInputting),
        f: common_vendor.o(handleConfirm),
        g: common_vendor.p({
          placeholder: "请输入",
          kwd: props.queryParam.keyword
        }),
        h: common_vendor.o(handleConfirm)
      } : {}, {
        i: searchSuggestionsList.value.length
      }, searchSuggestionsList.value.length ? {
        j: common_vendor.f(searchSuggestionsList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: common_vendor.o(($event) => handleSearchSuggestItemOnClick(item), index),
            c: index
          };
        })
      } : {}, {
        k: !__props.queryParam.keyword.trim() && __props.isNeedSearchInput
      }, !__props.queryParam.keyword.trim() && __props.isNeedSearchInput ? {
        l: common_vendor.o(handleClearSearchHistory),
        m: common_vendor.f(searchHistoryList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: item + index,
            c: common_vendor.o(($event) => handleSearchSuggestItemOnClick(item), item + index)
          };
        })
      } : {}, {
        n: __props.category1Id && menuList.value.length > 3 && (__props.queryParam.keyword.trim() || __props.category1Id)
      }, __props.category1Id && menuList.value.length > 3 && (__props.queryParam.keyword.trim() || __props.category1Id) ? {
        o: common_vendor.o(handleConfirm),
        p: common_vendor.o(($event) => menuList.value = $event),
        q: common_vendor.p({
          themeColor: checkedThemeColor.value,
          duration: 300,
          isClickMutuallyExclude: true,
          menuList: menuList.value
        })
      } : {}, {
        r: __props.category1Id && menuList.value.length <= 3 && (__props.queryParam.keyword.trim() || __props.category1Id)
      }, __props.category1Id && menuList.value.length <= 3 && (__props.queryParam.keyword.trim() || __props.category1Id) ? {
        s: common_vendor.o(handleConfirm),
        t: common_vendor.o(($event) => menuList.value = $event),
        v: common_vendor.p({
          themeColor: checkedThemeColor.value,
          duration: 300,
          isClickMutuallyExclude: true,
          menuList: menuList.value
        })
      } : {}, {
        w: !__props.category1Id && menuList.value.length <= 3 && (__props.queryParam.keyword.trim() || __props.category1Id)
      }, !__props.category1Id && menuList.value.length <= 3 && (__props.queryParam.keyword.trim() || __props.category1Id) ? {
        x: common_vendor.o(handleConfirm),
        y: common_vendor.o(($event) => menuList.value = $event),
        z: common_vendor.p({
          themeColor: checkedThemeColor.value,
          isClickMutuallyExclude: true,
          duration: 300,
          menuList: menuList.value
        })
      } : {});
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/components/SearchTop/SearchTop.vue"]]);
wx.createComponent(Component);
