"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_user = require("../../stores/user.js");
const utils_constant = require("../../utils/constant.js");
const api_user_user = require("../../api/user/user.js");
require("../../utils/utils.js");
require("../../api/order/order.js");
require("../../utils/request.js");
require("../../config/confjg.js");
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_cl_upload2 = common_vendor.resolveComponent("cl-upload");
  const _easycom_gui_page2 = common_vendor.resolveComponent("gui-page");
  (_easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_cl_upload2 + _easycom_gui_page2)();
}
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_cl_upload = () => "../../uni_modules/cl-upload/components/cl-upload/cl-upload.js";
const _easycom_gui_page = () => "../../Grace6/components/gui-page.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_cl_upload + UniForms + _easycom_gui_page)();
}
const UniForms = () => "../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "updateInfo",
  setup(__props) {
    const userStore = stores_user.useUserStore();
    console.log();
    const formDataRule = {
      nickname: {
        rules: [
          {
            required: true,
            errorMessage: "请填写昵称"
          }
        ]
      },
      avatarUrl: {
        rules: [
          {
            required: true,
            errorMessage: "请上传头像"
          }
        ]
      }
    };
    const formData = common_vendor.reactive({
      nickname: userStore.user.nickname,
      avatarUrl: userStore.user.avatarUrl
    });
    const formDataRef = common_vendor.ref();
    const avatarUrlList = common_vendor.reactive([userStore.user.avatarUrl]);
    const uploadImgSuccess = (res) => {
      console.log(res);
      avatarUrlList.push(res.data);
      formData.avatarUrl = res.data;
    };
    const submit = () => {
      formDataRef.value.validate().then(async (res) => {
        console.log("--------", res);
        try {
          const res2 = await api_user_user.user.updateUserInfo(formData);
          common_vendor.index.navigateBack({
            success: () => {
              userStore.getUserInfo();
            }
          });
        } catch (error) {
          console.log(error);
        }
      }).catch((err) => {
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => formData.nickname = $event),
        b: common_vendor.p({
          type: "text",
          placeholder: "请输入昵称（必填）",
          modelValue: formData.nickname
        }),
        c: common_vendor.p({
          label: "昵称",
          required: true,
          name: "nickname",
          ["validate-trigger"]: "bind"
        }),
        d: common_vendor.o(uploadImgSuccess),
        e: common_vendor.o(($event) => avatarUrlList = $event),
        f: common_vendor.p({
          fileType: "image",
          imageFormData: {
            count: 1,
            sizeType: ["original", "compressed"]
          },
          listStyle: {
            columns: 2
          },
          add: avatarUrlList.length < 1,
          action: common_vendor.unref(utils_constant.UPLOAD_URL).IMAGE,
          modelValue: avatarUrlList
        }),
        g: common_vendor.p({
          label: "头像",
          required: true,
          name: "avatarUrl"
        }),
        h: common_vendor.sr(formDataRef, "430535a4-1,430535a4-0", {
          "k": "formDataRef"
        }),
        i: common_vendor.o(($event) => formData = $event),
        j: common_vendor.p({
          ["label-width"]: "100",
          rules: formDataRule,
          modelValue: formData
        }),
        k: common_vendor.o(submit)
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/pages/updateInfo/updateInfo.vue"]]);
wx.createPage(MiniProgramPage);
