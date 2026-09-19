"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_utils = require("../../utils/utils.js");
const api_category_category = require("../../api/category/category.js");
const api_albums_albums = require("../../api/albums/albums.js");
require("../../stores/user.js");
const utils_constant = require("../../utils/constant.js");
const utils_mitt = require("../../utils/mitt.js");
require("../../utils/request.js");
require("../../config/confjg.js");
require("../../api/user/user.js");
require("../../api/order/order.js");
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_cl_upload2 = common_vendor.resolveComponent("cl-upload");
  const _easycom_uni_data_picker2 = common_vendor.resolveComponent("uni-data-picker");
  const _easycom_uni_tag2 = common_vendor.resolveComponent("uni-tag");
  const _easycom_gui_page2 = common_vendor.resolveComponent("gui-page");
  (_easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_cl_upload2 + _easycom_uni_data_picker2 + _easycom_uni_tag2 + _easycom_gui_page2)();
}
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_cl_upload = () => "../../uni_modules/cl-upload/components/cl-upload/cl-upload.js";
const _easycom_uni_data_picker = () => "../../uni_modules/uni-data-picker/components/uni-data-picker/uni-data-picker.js";
const _easycom_uni_tag = () => "../../uni_modules/uni-tag/components/uni-tag/uni-tag.js";
const _easycom_gui_page = () => "../../Grace6/components/gui-page.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_cl_upload + _easycom_uni_data_picker + _easycom_uni_tag + UniForms + AttributePopup + _easycom_gui_page)();
}
const AttributePopup = () => "../../components/AttributePopup/AttributePopup.js";
const UniForms = () => "../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "createAlbum",
  setup(__props) {
    const attributePopupRef = common_vendor.ref();
    const categoryPopupPickerRef = common_vendor.ref();
    const formDataRef = common_vendor.ref();
    const payTypeFormDataRef = common_vendor.ref();
    const formData = common_vendor.reactive({
      albumTitle: "",
      category3Id: "",
      albumIntro: "",
      coverUrl: "",
      // 付费必填
      payType: "0101",
      priceType: "0201",
      price: "",
      discount: "",
      vipDiscount: "",
      isOpen: "1",
      albumAttributeValueVoList: []
    });
    const formDataRule = {
      albumTitle: {
        rules: [
          {
            required: true,
            errorMessage: "请填写标题"
          }
        ]
      },
      coverUrl: {
        rules: [
          {
            required: true,
            errorMessage: "请上传封面"
          }
        ]
      },
      category3Id: {
        rules: [{
          required: true,
          errorMessage: "请选择专辑分类"
        }]
      },
      albumIntro: {
        rules: [
          {
            required: true,
            errorMessage: "请填写专辑简介"
          }
        ]
      },
      albumAttributeValueVoList: {
        rules: [
          {
            required: true,
            errorMessage: "请填写专辑简介"
          },
          {
            validateFunction: function(rule, value, data, callback) {
              if (attributeList.value.length !== selectedAttributeList.value.length) {
                callback("请将每个属性下标签都进行选择");
              }
              return true;
            }
          }
        ]
      }
    };
    const payTypeFormDataRule = {
      price: {
        rules: [
          {
            required: true,
            errorMessage: "请填写专辑原价"
          }
        ]
      },
      discount: {
        rules: [
          {
            required: true,
            errorMessage: "请填写专辑折扣"
          }
        ]
      },
      vipDiscount: {
        rules: [
          {
            required: true,
            errorMessage: "请填写会员折扣"
          }
        ]
      }
    };
    const coverUrlList = common_vendor.reactive([]);
    common_vendor.watch(coverUrlList, (val) => {
      console.log("coverUrlList", val);
      formData.coverUrl = val[0];
    });
    common_vendor.watch(() => formData.category3Id, (val) => {
      if (val) {
        getAttributeList(val);
      }
    }, { immediate: true });
    const selectedAttributeList = common_vendor.computed(() => {
      return formData.albumAttributeValueVoList.filter((item) => item.valueId !== -1);
    });
    const payTypeList = common_vendor.ref(utils_constant.PAY_TYPE);
    const priceTypeList = common_vendor.ref([
      // 	价格类型： 0201-单集 0202-整专辑
      { name: "单集", value: "0201" },
      { name: "整专辑", value: "0202" }
    ]);
    const categoryList = common_vendor.ref([]);
    const attributeList = common_vendor.ref([]);
    common_vendor.watch(attributeList, (val) => {
      formData.albumAttributeValueVoList = val.map((item) => {
        var _a, _b;
        return {
          attributeId: item.id,
          valueId: ((_a = item.attributeValueList.find((item2) => item2.id === item.checkedId)) == null ? void 0 : _a.id) || -1,
          valueName: ((_b = item.attributeValueList.find((item2) => item2.id === item.checkedId)) == null ? void 0 : _b.valueName) || ""
        };
      });
    }, { deep: true });
    const getCategoryList = async () => {
      try {
        const res = await api_category_category.courseService.findAllCategory();
        utils_utils.recursionTree(res.data, "text", "categoryName", "categoryChild");
        utils_utils.recursionTree(res.data, "value", "categoryId", "categoryChild");
        utils_utils.recursionTree(res.data, "children", "categoryChild");
        categoryList.value = res.data;
      } catch (error) {
        console.log(error);
      }
    };
    const getAttributeList = async (categoryId) => {
      try {
        const categoryAllParentsList = utils_utils.getAllParentArr(categoryList.value, categoryId, "value", "children");
        console.log("categoryAllParentsList", categoryAllParentsList);
        const res = await api_category_category.courseService.getAttrList(categoryAllParentsList[categoryAllParentsList.length - 1].value);
        res.data.forEach((item, index) => {
          var _a, _b;
          if ((_a = formData.albumAttributeValueVoList) == null ? void 0 : _a.length) {
            if (formData.albumAttributeValueVoList.find((item2) => item2.attributeId === item.id)) {
              item.checkedId = ((_b = formData.albumAttributeValueVoList.find((item2) => item2.attributeId === item.id)) == null ? void 0 : _b.valueId) || -1;
            } else {
              item.checkedId = -1;
            }
          } else {
            formData.albumAttributeValueVoList = [];
            item.checkedId = -1;
          }
          item.attributeValueList.forEach((item2, index2) => {
            item2.value = item2.id;
            item2.text = item2.valueName;
          });
        });
        attributeList.value = res.data;
      } catch (error) {
        console.log(error);
      }
    };
    const uploadImgSuccess = (res) => {
      console.log(res);
      coverUrlList.push(res.data);
    };
    const addAlbum = async () => {
      try {
        const res = await api_albums_albums.albumsService.addAlbum(formData);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    };
    const editAlbum = async () => {
      try {
        const res = await api_albums_albums.albumsService.editAlbum(formData);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    };
    const submit = () => {
      formDataRef.value.validate().then(async (res) => {
        console.log("--------", res);
        if (formData.payType != "0101") {
          payTypeFormDataRef.value.validate().then(async (res2) => {
            formData.id ? await editAlbum() : await addAlbum();
            common_vendor.index.navigateBack();
            utils_mitt.emitter.emit("reloadMyWork");
          }).catch((err) => {
          });
        } else {
          formData.id ? await editAlbum() : await addAlbum();
          common_vendor.index.navigateTo({
            url: "/pages/myWork/myWork"
          });
        }
      }).catch((err) => {
      });
    };
    const getAlbumDataInfo = async (albumId = 2) => {
      try {
        const res = await api_albums_albums.albumsService.getAlbumInfo(albumId);
        console.log(res);
        res.data.payType || (res.data.payType = "0101");
        res.data.priceType || (res.data.priceType = "0201");
        for (const key in res.data) {
          if (Object.prototype.hasOwnProperty.call(res.data, key)) {
            formData[key] = res.data[key];
          }
        }
        coverUrlList.push(res.data.coverUrl);
      } catch (error) {
        console.log(error);
      }
    };
    const secretChangeSwitch = (e) => {
      formData.isOpen = e.detail.value ? "0" : "1";
    };
    const payTypeRadioChange = (e) => {
      formData.payType = e.detail.value;
    };
    const priceTypeRadioChange = (e) => {
      formData.priceType = e.detail.value;
    };
    const openAttributePopup = () => {
      attributePopupRef.value.openPopup();
    };
    common_vendor.onReady(() => {
      formDataRef.value.setRules(formDataRule);
      payTypeFormDataRef.value.setRules(payTypeFormDataRule);
    });
    common_vendor.onLoad(async (option) => {
      await getCategoryList();
      option.id && await getAlbumDataInfo(option.id);
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(($event) => formData.albumTitle = $event),
        b: common_vendor.p({
          type: "text",
          placeholder: "请输入专辑名称（必填）",
          modelValue: formData.albumTitle
        }),
        c: common_vendor.p({
          label: "专辑名称",
          required: true,
          name: "albumTitle",
          ["validate-trigger"]: "bind"
        }),
        d: common_vendor.o(uploadImgSuccess),
        e: common_vendor.o(($event) => coverUrlList = $event),
        f: common_vendor.p({
          fileType: "image",
          imageFormData: {
            count: 1,
            sizeType: ["original", "compressed"]
          },
          listStyle: {
            columns: 2
          },
          add: coverUrlList.length < 1,
          action: common_vendor.unref(utils_constant.UPLOAD_URL).IMAGE,
          modelValue: coverUrlList
        }),
        g: common_vendor.p({
          label: "专辑封面",
          required: true,
          name: "coverUrl"
        }),
        h: common_vendor.sr(categoryPopupPickerRef, "f2ac770a-7,f2ac770a-6", {
          "k": "categoryPopupPickerRef"
        }),
        i: common_vendor.o(($event) => formData.category3Id = $event),
        j: common_vendor.p({
          placeholder: "请选择分类",
          ["popup-title"]: "请选择分类",
          localdata: categoryList.value,
          modelValue: formData.category3Id
        }),
        k: common_vendor.p({
          label: "专辑分类",
          required: true,
          name: "category3Id"
        }),
        l: attributeList.value.length
      }, attributeList.value.length ? common_vendor.e({
        m: !common_vendor.unref(selectedAttributeList).length
      }, !common_vendor.unref(selectedAttributeList).length ? {} : {
        n: common_vendor.f(formData.albumAttributeValueVoList, (item, index, i0) => {
          return {
            a: item.valueId,
            b: "f2ac770a-9-" + i0 + ",f2ac770a-8",
            c: common_vendor.p({
              type: "primary",
              text: item.valueName
            })
          };
        })
      }, {
        o: common_vendor.o(openAttributePopup),
        p: common_vendor.p({
          label: "专辑标签",
          required: true,
          name: "albumAttributeValueVoList"
        })
      }) : {}, {
        q: common_vendor.o(($event) => formData.albumIntro = $event),
        r: common_vendor.p({
          type: "textarea",
          placeholder: "请输入专辑简介",
          modelValue: formData.albumIntro
        }),
        s: common_vendor.p({
          label: "专辑简介",
          required: true,
          name: "albumIntro"
        }),
        t: common_vendor.o(secretChangeSwitch),
        v: formData.isOpen === "0",
        w: common_vendor.p({
          label: "设为私密",
          required: true,
          name: "isOpen"
        }),
        x: common_vendor.f(payTypeList.value, (item, index, i0) => {
          return {
            a: item.value,
            b: item.value === formData.payType,
            c: common_vendor.t(item.name),
            d: item.value
          };
        }),
        y: common_vendor.o(payTypeRadioChange),
        z: common_vendor.p({
          label: "付费类型",
          required: true,
          name: "albumIntro"
        }),
        A: common_vendor.f(priceTypeList.value, (item, index, i0) => {
          return {
            a: item.value,
            b: item.value === formData.priceType,
            c: common_vendor.t(item.name),
            d: item.value
          };
        }),
        B: common_vendor.o(priceTypeRadioChange),
        C: common_vendor.p({
          label: "价格类型",
          required: true,
          name: "priceType"
        }),
        D: common_vendor.o(($event) => formData.price = $event),
        E: common_vendor.p({
          type: "digit",
          trim: true,
          placeholder: "请输入原价（必填）",
          modelValue: formData.price
        }),
        F: common_vendor.p({
          label: "原  价",
          required: true,
          name: "price"
        }),
        G: common_vendor.o(($event) => formData.discount = $event),
        H: common_vendor.p({
          type: "digit",
          trim: true,
          placeholder: "取值:0.1至9.9, -1:不打折(必填)",
          modelValue: formData.discount
        }),
        I: common_vendor.p({
          label: "专辑折扣",
          required: true,
          name: "discount"
        }),
        J: common_vendor.o(($event) => formData.vipDiscount = $event),
        K: common_vendor.p({
          type: "digit",
          trim: true,
          placeholder: "取值:0.1至9.9, -1:不打折(必填)",
          modelValue: formData.vipDiscount
        }),
        L: common_vendor.p({
          label: "会员折扣",
          required: true,
          name: "vipDiscount"
        }),
        M: common_vendor.sr(payTypeFormDataRef, "f2ac770a-14,f2ac770a-1", {
          "k": "payTypeFormDataRef"
        }),
        N: common_vendor.o(($event) => formData = $event),
        O: common_vendor.p({
          rules: payTypeFormDataRule,
          ["label-width"]: "100",
          modelValue: formData
        }),
        P: formData.payType !== payTypeList.value[0].value,
        Q: common_vendor.sr(formDataRef, "f2ac770a-1,f2ac770a-0", {
          "k": "formDataRef"
        }),
        R: common_vendor.o(($event) => formData = $event),
        S: common_vendor.p({
          ["label-width"]: "100",
          rules: formDataRule,
          modelValue: formData
        }),
        T: common_vendor.o(submit),
        U: common_vendor.sr(attributePopupRef, "f2ac770a-22,f2ac770a-0", {
          "k": "attributePopupRef"
        }),
        V: common_vendor.p({
          attributeList: attributeList.value
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f2ac770a"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/pages/createAlbum/createAlbum.vue"]]);
wx.createPage(MiniProgramPage);
