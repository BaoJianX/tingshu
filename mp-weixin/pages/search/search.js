"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../stores/user.js");
const api_search_search = require("../../api/search/search.js");
require("../../utils/constant.js");
require("../../config/confjg.js");
require("../../utils/utils.js");
require("../../api/user/user.js");
require("../../utils/request.js");
require("../../api/order/order.js");
if (!Math) {
  (SearchTop + SearchResultsItem + ZPaging)();
}
const ZPaging = () => "../../uni_modules/z-paging/components/z-paging/z-paging.js";
const SearchTop = () => "../../components/SearchTop/SearchTop.js";
const SearchResultsItem = () => "../../components/SearchResultsItem/SearchResultsItem.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "search",
  props: {
    category1Id: {
      type: Number || String,
      default: ""
    },
    category2Id: {
      type: Number || String,
      default: ""
    },
    category3Id: {
      type: Number || String,
      default: ""
    },
    pageTitle: {
      type: String || Number,
      default: "搜索"
    }
  },
  setup(__props) {
    const props = __props;
    const zPagingRef = common_vendor.ref();
    const pageInfo = common_vendor.reactive({
      // 查询参数
      queryParams: {
        keyword: "",
        category1Id: 0,
        category2Id: 0,
        category3Id: 0,
        attributeList: [],
        order: ""
      },
      // 查询商品列表
      goodsList: []
    });
    const reloadSearch = () => {
      console.log("重载搜索");
      zPagingRef.value.reload();
    };
    const getSearchAlbumInfo = async (pageNo, pageSize) => {
      const params = {
        keyword: pageInfo.queryParams.keyword.trim(),
        category1Id: pageInfo.queryParams.category1Id ? pageInfo.queryParams.category1Id : null,
        category2Id: pageInfo.queryParams.category2Id ? pageInfo.queryParams.category2Id : null,
        category3Id: pageInfo.queryParams.category3Id ? pageInfo.queryParams.category3Id : null,
        attributeList: pageInfo.queryParams.attributeList.length > 0 ? pageInfo.queryParams.attributeList : null,
        order: pageInfo.queryParams.order ? pageInfo.queryParams.order : null,
        pageNo,
        pageSize
      };
      try {
        if (params.keyword || params.category3Id) {
          const res = await api_search_search.search.getSearchAlbumInfo(params);
          zPagingRef.value.complete(res.data.list);
        } else {
          zPagingRef.value.complete([]);
        }
      } catch (e) {
        console.log(e);
      }
    };
    common_vendor.onMounted(() => {
      console.log("props.category1Id", props.category1Id, props.category2Id, props.category3Id);
      pageInfo.queryParams.category1Id = props.category1Id;
      pageInfo.queryParams.category2Id = props.category2Id;
      pageInfo.queryParams.category3Id = props.category3Id;
      common_vendor.index.setNavigationBarTitle({
        title: props.pageTitle || "搜索"
      });
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          isNeedSearchInput: !__props.category1Id,
          category1Id: __props.category1Id,
          isNeedAttrFilter: true,
          handleSearch: reloadSearch,
          queryParam: pageInfo.queryParams
        }),
        b: common_vendor.f(pageInfo.goodsList, (item, index, i0) => {
          return {
            a: item.id,
            b: "0e25d9e4-2-" + i0 + ",0e25d9e4-0",
            c: common_vendor.p({
              data: item
            })
          };
        }),
        c: common_vendor.sr(zPagingRef, "0e25d9e4-0", {
          "k": "zPagingRef"
        }),
        d: common_vendor.o(getSearchAlbumInfo),
        e: common_vendor.o(($event) => pageInfo.goodsList = $event),
        f: common_vendor.p({
          ["default-page-size"]: 20,
          ["show-refresher-update-time"]: true,
          ["auto-show-back-to-top"]: true,
          modelValue: pageInfo.goodsList
        })
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/pages/search/search.vue"]]);
wx.createPage(MiniProgramPage);
