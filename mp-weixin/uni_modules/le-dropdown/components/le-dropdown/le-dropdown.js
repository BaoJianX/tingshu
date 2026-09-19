"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_leDropdown_components_leDropdown_utils_cloneDeep = require("./utils/cloneDeep.js");
const uni_modules_leDropdown_components_leDropdown_utils_hexToRgb = require("./utils/hexToRgb.js");
if (!Math) {
  LeDropdownPicker();
}
const LeDropdownPicker = () => "./components/le-picker.js";
const _sfc_main = {
  __name: "le-dropdown",
  props: {
    // 导航数据
    menuList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 主题的颜色
    themeColor: {
      type: String,
      default: "#3185FF"
    },
    // 没选中的颜色
    inactiveColor: {
      type: String,
      default: "#333333"
    },
    // 过渡时间
    duration: {
      type: [Number, String],
      default: 300
    },
    // todo start 修改源码
    // 是否单击互斥，当单击互斥的时候，菜单对应click需要增添isChecked属性
    // {
    //   title: "综合排序",
    //     type: "click",
    //   value: "1:desc",
    //   // 自定义属性，用于满足type = click时候的互斥
    //   isChecked:false
    // }
    isClickMutuallyExclude: {
      type: Boolean,
      default: false
    }
    // todo end 修改源码
  },
  emits: ["open", "close", "update:menuList", "onConfirm", "onChange"],
  setup(__props, { emit: emits }) {
    const props = __props;
    const initMenuList = uni_modules_leDropdown_components_leDropdown_utils_cloneDeep.deepClone(props.menuList);
    const instance = common_vendor.getCurrentInstance();
    const popupStyle = common_vendor.computed(() => {
      let style = {};
      style.transform = `translateY(${active.value ? 0 : "-100%"})`;
      style["transition-duration"] = props.duration / 1e3 + "s";
      return style;
    });
    const current = common_vendor.ref(99999);
    const contentStyle = common_vendor.ref({
      zIndex: -1,
      opacity: 0
    });
    const active = common_vendor.ref(false);
    const contentHeight = common_vendor.ref(0);
    common_vendor.ref(null);
    const windowTop = common_vendor.ref(0);
    common_vendor.index.getSystemInfo({
      success(e) {
        windowTop.value = e.windowTop;
      }
    });
    const menuClick = (index) => {
      switch (props.menuList[index].type) {
        case "sort":
          onSort(index);
          break;
        case "click":
          onClick(index);
          break;
        default:
          if (index === current.value) {
            close();
            return;
          }
          open(index);
          break;
      }
    };
    const open = (index) => {
      active.value = true;
      contentStyle.value.zIndex = 11;
      contentStyle.value.opacity = 1;
      current.value = index;
      emits("open", current.value);
    };
    const close = () => {
      active.value = false;
      contentStyle.value.opacity = 0;
      setTimeout(() => {
        contentStyle.value.zIndex = -1;
        current.value = 99999;
      }, props.duration);
      emits("close", current.value);
    };
    const getContentHeight = () => {
      common_vendor.index.createSelectorQuery().in(instance).selectAll(".le-dropdown-menu").boundingClientRect().exec((data) => {
        contentHeight.value = data[0][0].bottom;
      });
    };
    const onSort = (index) => {
      if (props.menuList[index].type === "click") {
        props.menuList[index].isChecked = props.menuList[index].isChecked;
      }
      const type = current.value === 99999 ? current.value : props.menuList[current.value].type;
      switch (type) {
        case "sort":
        case "click":
        case 99999:
          start();
          break;
        default:
          close();
          setTimeout(() => {
            start();
          }, props.duration);
          break;
      }
      function start() {
        const menuList = uni_modules_leDropdown_components_leDropdown_utils_cloneDeep.deepClone(props.menuList);
        current.value = index;
        menuList[index].value = !menuList[index].value ? "asc" : menuList[index].value == "asc" ? "desc" : null;
        emits("update:menuList", menuList);
        emits("onConfirm", menuList[index]);
      }
    };
    const onClick = (index) => {
      if (props.isClickMutuallyExclude) {
        props.menuList.forEach((item, index2) => {
          if (item.type === "click") {
            item.isChecked = index === index2;
          }
        });
      }
      const type = current.value === 99999 ? current.value : props.menuList[current.value].type;
      switch (type) {
        case "sort":
        case "click":
        case 99999:
          start();
          break;
        default:
          console.log("default");
          close();
          setTimeout(() => {
            start();
          }, props.duration);
          break;
      }
      function start() {
        const menuList = uni_modules_leDropdown_components_leDropdown_utils_cloneDeep.deepClone(props.menuList);
        current.value = index;
        emits("onConfirm", menuList[index]);
      }
    };
    const onSelectCell = (sItem, index) => {
      const menuList = uni_modules_leDropdown_components_leDropdown_utils_cloneDeep.deepClone(props.menuList);
      menuList[index].title = sItem.label;
      menuList[index].value = sItem.value;
      emits("update:menuList", menuList);
      close();
      emits("onConfirm", menuList[index]);
    };
    const onRadioFilter = (sIndex, ssItem, index) => {
      const menuList = uni_modules_leDropdown_components_leDropdown_utils_cloneDeep.deepClone(props.menuList);
      menuList[index].children[sIndex].value = ssItem.value;
      emits("update:menuList", menuList);
      emits("onChange", menuList[index], sIndex);
    };
    const onCheckboxFilter = (sIndex, ssItem, index) => {
      const menuList = uni_modules_leDropdown_components_leDropdown_utils_cloneDeep.deepClone(props.menuList);
      const indexs = menuList[index].children[sIndex].value.indexOf(ssItem.value);
      if (indexs != -1) {
        menuList[index].children[sIndex].value.splice(indexs, 1);
      } else {
        menuList[index].children[sIndex].value.push(ssItem.value);
      }
      emits("update:menuList", menuList);
      emits("onChange", menuList[index], sIndex);
    };
    const onSliderChange = (event, sIndex, ssItem, index) => {
      const menuList = uni_modules_leDropdown_components_leDropdown_utils_cloneDeep.deepClone(props.menuList);
      menuList[index].children[sIndex].value = event.detail.value;
      emits("update:menuList", menuList);
      emits("onChange", menuList[index], sIndex);
    };
    const onFilterReset = (item, index) => {
      const menuList = uni_modules_leDropdown_components_leDropdown_utils_cloneDeep.deepClone(props.menuList);
      menuList[index].children.forEach((items, indexs) => {
        items.value = initMenuList[index].children[indexs].value;
      });
      emits("update:menuList", menuList);
    };
    const onFilterConfirm = (item, index) => {
      close();
      const menuList = uni_modules_leDropdown_components_leDropdown_utils_cloneDeep.deepClone(props.menuList);
      emits("onConfirm", menuList[index]);
    };
    common_vendor.onMounted(() => {
      getContentHeight();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(__props.menuList, (item, index, i0) => {
          return common_vendor.e({
            a: item.type === "click" && __props.isClickMutuallyExclude
          }, item.type === "click" && __props.isClickMutuallyExclude ? {
            b: common_vendor.t(item.title),
            c: index === current.value || item.isChecked ? __props.themeColor : __props.inactiveColor
          } : common_vendor.e({
            d: common_vendor.t(item.title),
            e: index === current.value ? __props.themeColor : __props.inactiveColor,
            f: item.type === "sort"
          }, item.type === "sort" ? {
            g: common_vendor.n(item.value === "asc" && "le-dropdown-menu-item-arrow_top"),
            h: common_vendor.n(item.value === "desc" && "le-dropdown-menu-item-arrow_bottom")
          } : {}, {
            i: item.type !== "sort"
          }, item.type !== "sort" ? {
            j: common_vendor.n(index === current.value && "le-dropdown-menu-item-basicarrow_rotate")
          } : {}), {
            k: index,
            l: common_vendor.o(($event) => menuClick(index), index)
          });
        }),
        b: common_vendor.f(__props.menuList, (item, index, i0) => {
          return common_vendor.e({
            a: item.type === "cell" && index === current.value
          }, item.type === "cell" && index === current.value ? {
            b: common_vendor.f(item.options, (sItem, sIndex, i1) => {
              return {
                a: common_vendor.t(sItem.label),
                b: common_vendor.n(item.value === sItem.value && "le-dropdown-cell-active"),
                c: sIndex,
                d: common_vendor.o(($event) => onSelectCell(sItem, index), sIndex)
              };
            })
          } : {}, {
            c: item.type === "picker" && index === current.value
          }, item.type === "picker" && index === current.value ? {
            d: "835732cc-0-" + i0,
            e: common_vendor.o(($event) => item.value = $event, index),
            f: common_vendor.p({
              ...item.componentProps,
              modelValue: item.value
            }),
            g: common_vendor.t(item.confirmText || "确定"),
            h: common_vendor.o(($event) => onFilterConfirm(item, index), index)
          } : {}, {
            i: item.type === "filter" && index === current.value
          }, item.type === "filter" && index === current.value ? {
            j: common_vendor.f(item.children, (sItem, sIndex, i1) => {
              return common_vendor.e({
                a: common_vendor.t(sItem.title),
                b: sItem.type === "slider"
              }, sItem.type === "slider" ? {
                c: common_vendor.t(sItem.value),
                d: common_vendor.t(sItem.suffix)
              } : {}, {
                e: sItem.type === "radio"
              }, sItem.type === "radio" ? {
                f: common_vendor.f(sItem.options, (ssItem, ssIndex, i2) => {
                  return {
                    a: common_vendor.t(ssItem.label),
                    b: common_vendor.n(sItem.value === ssItem.value && "le-dropdown-filter-box-active"),
                    c: ssIndex,
                    d: common_vendor.o(($event) => onRadioFilter(sIndex, ssItem, index), ssIndex)
                  };
                })
              } : sItem.type === "checkbox" ? {
                h: common_vendor.f(sItem.options, (ssItem, ssIndex, i2) => {
                  return {
                    a: common_vendor.t(ssItem.label),
                    b: common_vendor.n(sItem.value.includes(ssItem.value) && "le-dropdown-filter-box-active"),
                    c: ssIndex,
                    d: common_vendor.o(($event) => onCheckboxFilter(sIndex, ssItem, index), ssIndex)
                  };
                })
              } : sItem.type === "slider" ? {
                j: __props.themeColor,
                k: sItem.value,
                l: sItem.componentProps.min || 0,
                m: sItem.componentProps.max || 100,
                n: sItem.componentProps.step || 1,
                o: sItem.componentProps["show-value"] || true,
                p: common_vendor.o(($event) => onSliderChange($event, sIndex, _ctx.ssItem, index), sIndex)
              } : {}, {
                g: sItem.type === "checkbox",
                i: sItem.type === "slider",
                q: sIndex
              });
            }),
            k: common_vendor.o(($event) => onFilterReset(item, index), index),
            l: common_vendor.t(item.confirmText || "确定"),
            m: common_vendor.o(($event) => onFilterConfirm(item, index), index)
          } : {}, {
            n: index
          });
        }),
        c: common_vendor.s(common_vendor.unref(popupStyle)),
        d: common_vendor.o(() => {
        }),
        e: common_vendor.s(contentStyle.value),
        f: common_vendor.s({
          transition: `opacity ${__props.duration / 1e3}s linear`,
          top: "80rpx",
          height: `calc(100vh - ${contentHeight.value + windowTop.value}px)`
        }),
        g: common_vendor.o(close),
        h: common_vendor.s(`--dropdownThemeColor:${__props.themeColor};--dropdownThemeColorRgb:${common_vendor.unref(uni_modules_leDropdown_components_leDropdown_utils_hexToRgb.hexToRgb)(__props.themeColor)}`)
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-835732cc"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/uni_modules/le-dropdown/components/le-dropdown/le-dropdown.vue"]]);
wx.createComponent(Component);
