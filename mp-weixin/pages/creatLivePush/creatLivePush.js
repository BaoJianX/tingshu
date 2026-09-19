"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../stores/user.js");
const utils_constant = require("../../utils/constant.js");
const api_live_live = require("../../api/live/live.js");
require("../../utils/utils.js");
require("../../api/user/user.js");
require("../../utils/request.js");
require("../../config/confjg.js");
require("../../api/order/order.js");
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_cl_upload2 = common_vendor.resolveComponent("cl-upload");
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  const _easycom_gui_page2 = common_vendor.resolveComponent("gui-page");
  (_easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_cl_upload2 + _easycom_uni_data_select2 + _easycom_uni_datetime_picker2 + _easycom_gui_page2)();
}
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_cl_upload = () => "../../uni_modules/cl-upload/components/cl-upload/cl-upload.js";
const _easycom_uni_data_select = () => "../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_uni_datetime_picker = () => "../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
const _easycom_gui_page = () => "../../Grace6/components/gui-page.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_cl_upload + _easycom_uni_data_select + _easycom_uni_datetime_picker + UniForms + _easycom_gui_page)();
}
const UniForms = () => "../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "creatLivePush",
  setup(__props) {
    const formDataRef = common_vendor.ref();
    const formData = common_vendor.reactive({
      liveTitle: "",
      coverUrl: "",
      tagId: "",
      expireTime: "",
      longitude: "104.07275",
      latitude: "30.57899",
      location: "北京市立水桥"
    });
    const liveTagList = common_vendor.ref([]);
    const formDataRule = {
      liveTitle: {
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
      tagId: {
        rules: [
          {
            required: true,
            errorMessage: "请选择标签"
          }
        ]
      },
      expireTime: {
        rules: [
          {
            required: true,
            errorMessage: "请选择国企时间"
          }
        ]
      }
    };
    const coverUrlList = common_vendor.reactive([]);
    common_vendor.watch(coverUrlList, (val) => {
      console.log("coverUrlList", val);
      formData.coverUrl = val[0];
    });
    const getLiveTagList = async () => {
      try {
        const res = await api_live_live.liveService.getLiveTagList();
        res.data.forEach((item) => {
          item.text = item.name;
          item.value = item.id;
        });
        liveTagList.value = res.data;
      } catch (error) {
        console.log(error);
      }
    };
    const uploadImgSuccess = (res) => {
      console.log(res);
      coverUrlList.push(res.data);
    };
    const createLiveRoom = async () => {
      try {
        const res = await api_live_live.liveService.createLiveRoom(formData);
        console.log(res);
        return res.data;
      } catch (error) {
        console.log("error", error);
      }
    };
    const submit = () => {
      formDataRef.value.validate().then(async (res) => {
        console.log(res);
        const result = await createLiveRoom();
        console.log("result", result);
        if (result == null ? void 0 : result.id) {
          common_vendor.index.navigateTo({
            url: `/pages/livePush/livePush?id=${result == null ? void 0 : result.id}`
          });
        }
      }).catch((error) => {
        console.log("error", error);
      });
    };
    common_vendor.onReady(() => {
      formDataRef.value.setRules(formDataRule);
    });
    common_vendor.onLoad(async () => {
      await getLiveTagList();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => formData.liveTitle = $event),
        b: common_vendor.p({
          type: "text",
          placeholder: "请输入专辑名称（必填）",
          modelValue: formData.liveTitle
        }),
        c: common_vendor.p({
          label: "标题",
          required: true,
          name: "liveTitle",
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
          label: "封面",
          required: true,
          name: "coverUrl"
        }),
        h: common_vendor.o(($event) => formData.tagId = $event),
        i: common_vendor.p({
          localdata: liveTagList.value,
          modelValue: formData.tagId
        }),
        j: common_vendor.p({
          label: "标签",
          required: true,
          name: "tagId"
        }),
        k: common_vendor.o(($event) => formData.expireTime = $event),
        l: common_vendor.p({
          type: "datetime",
          placeholder: "请选择过期时间",
          modelValue: formData.expireTime
        }),
        m: common_vendor.p({
          label: "过期时间",
          required: true,
          name: "expireTime"
        }),
        n: common_vendor.sr(formDataRef, "3038e123-1,3038e123-0", {
          "k": "formDataRef"
        }),
        o: common_vendor.o(($event) => formData = $event),
        p: common_vendor.p({
          ["label-width"]: "100",
          rules: formDataRule,
          modelValue: formData
        }),
        q: common_vendor.o(submit)
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3038e123"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/pages/creatLivePush/creatLivePush.vue"]]);
wx.createPage(MiniProgramPage);
