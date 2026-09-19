"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../stores/user.js");
const utils_constant = require("../../utils/constant.js");
const api_albums_albums = require("../../api/albums/albums.js");
const utils_mitt = require("../../utils/mitt.js");
require("../../utils/utils.js");
require("../../api/user/user.js");
require("../../utils/request.js");
require("../../config/confjg.js");
require("../../api/order/order.js");
if (!Array) {
  const _easycom_cl_upload2 = common_vendor.resolveComponent("cl-upload");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  const _easycom_gui_page2 = common_vendor.resolveComponent("gui-page");
  (_easycom_cl_upload2 + _easycom_uni_forms_item2 + _easycom_uni_easyinput2 + _easycom_uni_data_select2 + _easycom_gui_page2)();
}
const _easycom_cl_upload = () => "../../uni_modules/cl-upload/components/cl-upload/cl-upload.js";
const _easycom_uni_forms_item = () => "../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_data_select = () => "../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_gui_page = () => "../../Grace6/components/gui-page.js";
if (!Math) {
  (_easycom_cl_upload + _easycom_uni_forms_item + _easycom_uni_easyinput + _easycom_uni_data_select + UniForms + _easycom_gui_page)();
}
const UniForms = () => "../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "createTrack",
  props: {
    id: {
      type: String,
      default: ""
    }
  },
  setup(__props) {
    const props = __props;
    const formDataRef = common_vendor.ref();
    const formData = common_vendor.reactive({
      mediaFileId: "",
      //媒体文件的唯一标识
      mediaUrl: "",
      //媒体文件的路径
      trackTitle: "",
      // 声音标题
      coverUrl: "",
      // 声音封面
      albumId: "",
      // 专辑id
      trackIntro: "",
      // 声音简介
      isOpen: 1
      // 是否公开：0-否 1-是
      // id: '', // 专辑id
    });
    const albumList = common_vendor.ref([]);
    const formDataRule = {
      mediaUrl: {
        rules: [
          {
            required: true,
            errorMessage: "请上传声音"
          }
        ]
      },
      trackTitle: {
        rules: [
          {
            required: true,
            errorMessage: "请填写标题"
          }
        ]
      },
      // coverUrl: {
      //   rules: [
      //     {
      //       required: true,
      //       errorMessage: "请上传封面"
      //     }
      //   ]
      // },
      albumId: {
        rules: [
          {
            required: true,
            errorMessage: "请选择所属专辑"
          }
        ]
      }
    };
    const coverUrlList = common_vendor.reactive([]);
    common_vendor.watch(coverUrlList, (val) => {
      console.log("coverUrlList", val);
      formData.coverUrl = val[0];
    });
    const mediaFileList = common_vendor.reactive([]);
    common_vendor.watch(mediaFileList, (val) => {
      formData.mediaUrl = val[0];
    });
    const getAllAlbumList = async () => {
      try {
        const res = await api_albums_albums.albumsService.getAllAlbumList();
        albumList.value = res.data;
        albumList.value.forEach((item) => {
          item.text = item.albumTitle.length > 15 ? item.albumTitle.slice(0, 15) + "..." : item.albumTitle;
          item.value = item.id;
        });
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    };
    const getTrackInfo = async (id) => {
      try {
        const res = await api_albums_albums.albumsService.getTrackInfo(id);
        for (const key in res.data) {
          if (Object.prototype.hasOwnProperty.call(res.data, key)) {
            formData[key] = res.data[key];
          }
        }
        res.data.coverUrl && coverUrlList.push(res.data.coverUrl);
        mediaFileList.push(res.data.mediaUrl);
        console.log("mediaFileList.push", mediaFileList);
      } catch (error) {
        console.log(error);
      }
    };
    const uploadImgSuccess = (res) => {
      console.log("uploadImgSuccess", res);
      coverUrlList.push(res.data);
    };
    const uploadAudioSuccess = (res) => {
      console.log("uploadAudioSuccess", res.data);
      mediaFileList.push(res.data.mediaUrl);
      formData.mediaFileId = res.data.mediaFileId;
    };
    const addAlbum = async () => {
      try {
        const res = await api_albums_albums.albumsService.addTrackInfo(formData);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    };
    const editAlbum = async () => {
      try {
        const res = await api_albums_albums.albumsService.editTrackInfo(formData);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    };
    const submit = () => {
      formDataRef.value.validate().then(async (res) => {
        console.log("formData", formData);
        formData.id ? await editAlbum() : await addAlbum();
        common_vendor.index.navigateBack();
        utils_mitt.emitter.emit("reloadMyWork");
      }).catch((err) => {
        console.log(err);
      });
    };
    const secretChangeSwitch = (e) => {
      formData.isOpen = e.detail.value ? 0 : 1;
    };
    common_vendor.onReady(() => {
      formDataRef.value.setRules(formDataRule);
    });
    common_vendor.onLoad((option) => {
      getAllAlbumList();
      option.id && getTrackInfo(option.id);
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.n(mediaFileList.length ? "audio-upload-success" : ""),
        b: common_vendor.o(uploadAudioSuccess),
        c: common_vendor.o(($event) => mediaFileList = $event),
        d: common_vendor.p({
          fileType: "video",
          imageFormData: {
            count: 1,
            sizeType: ["original", "compressed"]
          },
          listStyle: {
            columns: 2
          },
          add: mediaFileList.length < 1,
          action: common_vendor.unref(utils_constant.UPLOAD_URL).TRACK,
          modelValue: mediaFileList
        }),
        e: common_vendor.p({
          label: "上传声音",
          required: true,
          name: "mediaUrl",
          ["validate-trigger"]: "bind"
        }),
        f: common_vendor.o(($event) => formData.trackTitle = $event),
        g: common_vendor.p({
          type: "text",
          placeholder: "请输入专辑名称（必填）",
          modelValue: formData.trackTitle
        }),
        h: common_vendor.p({
          label: "声音标题",
          required: true,
          name: "trackTitle",
          ["validate-trigger"]: "bind"
        }),
        i: common_vendor.o(uploadImgSuccess),
        j: common_vendor.o(($event) => coverUrlList = $event),
        k: common_vendor.p({
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
        l: common_vendor.p({
          label: "声音封面",
          name: "coverUrl"
        }),
        m: common_vendor.o(($event) => formData.albumId = $event),
        n: common_vendor.p({
          disabled: !!props.id,
          localdata: albumList.value,
          clear: true,
          modelValue: formData.albumId
        }),
        o: common_vendor.p({
          label: "专辑分类",
          required: true,
          name: "albumId"
        }),
        p: common_vendor.o(($event) => formData.trackIntro = $event),
        q: common_vendor.p({
          type: "textarea",
          placeholder: "请输入专辑简介",
          modelValue: formData.trackIntro
        }),
        r: common_vendor.p({
          label: "声音简介",
          name: "trackIntro"
        }),
        s: common_vendor.o(secretChangeSwitch),
        t: formData.isOpen === 0,
        v: common_vendor.p({
          label: "设为私密",
          required: true,
          name: "isOpen"
        }),
        w: common_vendor.sr(formDataRef, "47ea33ae-1,47ea33ae-0", {
          "k": "formDataRef"
        }),
        x: common_vendor.o(($event) => formData = $event),
        y: common_vendor.p({
          ["label-width"]: "100",
          rules: formDataRule,
          modelValue: formData
        }),
        z: common_vendor.o(submit)
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-47ea33ae"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/pages/createTrack/createTrack.vue"]]);
wx.createPage(MiniProgramPage);
