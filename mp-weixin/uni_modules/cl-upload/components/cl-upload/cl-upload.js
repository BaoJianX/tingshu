"use strict";
const common_vendor = require("../../../../common/vendor.js");
const ClImage = () => "../cl-image/cl-image.js";
const _sfc_main = {
  name: "cl-upload",
  emit: ["onImage", "onImageSize", "onError", "onVideoMax", "onVideoSize", "onProgress", "onSuccess", "onVideo", "onImage"],
  props: {
    //受控图片列表
    modelValue: {
      type: Array,
      default: () => []
    },
    // 存储云类型 oss阿里云  vframe七牛云   process腾讯云  other其他
    cloudType: {
      type: String,
      default: "oss"
    },
    // 标识符,即后端接口参数名
    fileName: {
      type: String,
      default: "file"
    },
    // 文件类型 'image', 'video', 'all'
    fileType: {
      type: String,
      default: "all"
    },
    // 上传图片参数
    imageFormData: {
      type: Object,
      default: () => {
      }
    },
    // 上传视频参数
    videoFromData: {
      type: Object,
      default: () => {
      }
    },
    // 必选参数，上传的地址
    action: {
      type: String,
      default: ""
    },
    // 设置上传的请求头部
    headers: {
      type: Object,
      default: () => {
      }
    },
    // 上传时附带的额外参数
    data: {
      type: Object,
      default: () => {
      }
    },
    // 是否开启预览图片
    isPreviewImage: {
      type: Boolean,
      default: true
    },
    // 图片指示器样式，可取值："default" - 底部圆点指示器； "number" - 顶部数字指示器； "none" - 不显示指示器。
    indicator: {
      type: String,
      default: "none"
    },
    // 是否在选取文件后立即进行上传	
    autoUpload: {
      type: Boolean,
      default: true
    },
    // 是否显示删除按钮
    remove: {
      type: Boolean,
      default: true
    },
    // 是否添加按钮
    add: {
      type: Boolean,
      default: true
    },
    // 最多显示数量
    max: {
      type: Number,
      default: 9
    },
    // 视频最大上传数量
    maxVideo: {
      type: Number,
      default: 0
    },
    // 列表样式
    listStyle: {
      type: Object,
      default: () => {
      }
    },
    // 删除提示弹窗标题
    deleteTitle: {
      type: String,
      default: "提示"
    },
    // 删除提示弹窗文案
    deleteText: {
      type: String,
      default: "您确认要删除吗？"
    }
  },
  components: { ClImage },
  data() {
    return {
      // 渲染列表
      FileList: [],
      // 预览视频地址
      tempVideoUrl: "",
      // 临时文件列表
      tempFile_paths: [],
      // 错误的图片index数组
      errorList: [],
      // 图片资源
      addImg: "https://mp-61599c79-d7ee-4a75-a24b-e5a288da6dd3.cdn.bspapp.com/cloudstorage/bb1550b3-e0a8-4a90-a86f-00f8c6afa9fb.png",
      playImg: "https://mp-61599c79-d7ee-4a75-a24b-e5a288da6dd3.cdn.bspapp.com/cloudstorage/ae40402f-aa53-4344-b553-2322799bebd6.png",
      closeImg: "https://mp-61599c79-d7ee-4a75-a24b-e5a288da6dd3.cdn.bspapp.com/cloudstorage/cde4362d-7ec7-4cac-a692-12e1f576be1e.png",
      deleteImg: "https://mp-61599c79-d7ee-4a75-a24b-e5a288da6dd3.cdn.bspapp.com/cloudstorage/d20177a5-417e-4c5d-a266-1988361c543d.png"
    };
  },
  watch: {
    "modelValue": {
      handler: function(newVal, oldVal) {
        this.FileList = newVal;
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    listRowStyle() {
      var _a, _b, _c, _d;
      const style = {
        "grid-template-columns": `repeat(${((_a = this.listStyle) == null ? void 0 : _a.columns) || 4}, 1fr)`,
        // 每行数量	
        "grid-column-gap": ((_b = this.listStyle) == null ? void 0 : _b.columnGap) || "40rpx",
        // 行间距	
        "grid-row-gap": ((_c = this.listStyle) == null ? void 0 : _c.rowGap) || "40rpx",
        // 列间距
        "padding": ((_d = this.listStyle) == null ? void 0 : _d.padding) || "0rpx"
        // 列表内边距
      };
      return style;
    },
    rowStyle() {
      var _a, _b, _c;
      const style = {
        "aspect-ratio": ((_a = this.listStyle) == null ? void 0 : _a.height) ? "" : ((_b = this.listStyle) == null ? void 0 : _b.ratio) || "1/1",
        // 图片比例	
        "height": ((_c = this.listStyle) == null ? void 0 : _c.height) || "140rpx"
      };
      return style;
    },
    imgStyle() {
      var _a;
      const style = {
        "border-radius": ((_a = this.listStyle) == null ? void 0 : _a.radius) || "6rpx"
        // 图片圆角
      };
      return style;
    }
  },
  methods: {
    imgerror(e, item, index) {
      if (this.errorList.indexOf(index) === -1) {
        this.errorList.push(index);
      }
    },
    /**
     * 删除已选择文件
     * @param {object} item 文件信息
     * @param {number} index 文件索引
     * */
    onRemove(item, index) {
      common_vendor.index.showModal({
        title: this.deleteTitle,
        content: this.deleteText,
        success: (res) => {
          if (res.confirm) {
            const tempFileIndex = this.tempFile_paths.indexOf(item.url || item);
            if (tempFileIndex > -1) {
              this.tempFile_paths.splice(tempFileIndex, 1);
            }
            this.FileList.splice(index, 1);
            this.$emit("update:modelValue", this.FileList);
          }
        }
      });
    },
    /**
     * 点击已选择文件
     * @param {object} item 文件信息
     * @param {number} index 文件索引 
     * */
    onClickRow(item, index) {
      this.previewImage((item == null ? void 0 : item.url) ?? item, index);
      this.$emit("onImage", {
        item,
        index
      });
    },
    /**
     * 点击选择图片按钮
     * */
    onClickAdd() {
      switch (this.fileType) {
        case "image":
          this.onChooseFile(1);
          break;
        case "video":
          this.onChooseFile(2);
          break;
        case "all":
          common_vendor.index.showActionSheet({
            itemList: ["相册", "视频"],
            success: (res) => {
              const tapIndex = res.tapIndex;
              if (tapIndex === 0) {
                this.onChooseFile(1);
              } else {
                this.onChooseFile(2);
              }
            },
            fail: (res) => {
              console.error(res.errMsg);
            }
          });
          break;
        default:
          this.onChooseFile(1);
          break;
      }
    },
    /**
     * 从本地选择文件。
     * @param { number } updataType 选择类型 1:图片 2视频
     * */
    async onChooseFile(updataType) {
      const that = this;
      if (updataType === 1) {
        const data = Object.assign({}, {
          // 最多可以选择的图片张数，默认9
          count: 9,
          // 仅对 mediaType 为 image 时有效，是否压缩所选文件
          sizeType: ["original", "compressed"],
          // album 从相册选图，camera 使用相机，默认二者都有。
          sourceType: ["camera", "album"],
          compress: false
        }, this.imageFormData);
        data["count"] = this.max - this.FileList.length;
        common_vendor.index.chooseImage({
          ...data,
          success: async (res) => {
            var _a, _b;
            const tempFilePaths = res.tempFiles;
            const compress = ((_a = that.imageFormData) == null ? void 0 : _a.compress) || false;
            if (((_b = that.imageFormData) == null ? void 0 : _b.size) ?? false) {
              tempFilePaths.map((imgInfo, index) => {
                const maxSize = that.imageFormData.size * 1024 * 1024;
                if (imgInfo.size > maxSize) {
                  tempFilePaths.splice(index, 1);
                  that.$emit("onImageSize", imgInfo);
                  common_vendor.index.showToast({
                    title: `图片最大上传${that.imageFormData.size}MB`,
                    duration: 2e3,
                    icon: "none"
                  });
                }
              });
            }
            if (compress && tempFilePaths.length > 0) {
              const compressImage = await that.compressImage(tempFilePaths);
              upload(compressImage);
            } else {
              upload(tempFilePaths.map((item) => item.path));
            }
            function upload(imagesTemp) {
              if (that.autoUpload) {
                imagesTemp.map((item) => {
                  that.updataFile(item, "image");
                });
              } else {
                that.FileList = [...that.FileList, ...imagesTemp];
                that.tempFile_paths = [...that.tempFile_paths, ...imagesTemp];
              }
            }
          },
          fail(err) {
            that.$emit("onError", err);
            console.error("选择图片失败", err);
          }
        });
      }
      if (updataType === 2) {
        const VIDEO_REGEXP = /\.(mp4|flv|avi)/i;
        const videoList = await that.FileList.filter((item) => {
          const fileUrl = (item == null ? void 0 : item.url) ?? item;
          return VIDEO_REGEXP.test(fileUrl);
        });
        if (that.maxVideo > 0 && videoList.length >= that.maxVideo) {
          that.$emit("onVideoMax", that.maxVideo, videoList.length);
          return common_vendor.index.showToast({
            title: "视频数量已超出",
            duration: 2e3,
            icon: "none"
          });
        }
        const data = Object.assign({}, {
          // 	拍摄视频最长拍摄时间，单位秒。最长支持 60 秒。
          maxDuration: 60,
          // 'front'、'back'，默认'back'
          camera: "back",
          // album 从相册选视频，camera 使用相机拍摄，默认二者都有。
          sourceType: ["camera", "album"],
          // 是否压缩所选的视频源文件，默认值为 true，需要压缩。
          compressed: true
          // 'front'、'back'，默认'back'
        }, this.videoFromData);
        common_vendor.index.chooseVideo({
          ...data,
          success: (res) => {
            var _a;
            let tempFilePath = res.tempFilePath;
            if (((_a = that.videoFromData) == null ? void 0 : _a.size) ?? false) {
              const maxSize = that.videoFromData.size * 1024 * 1024;
              if (res.size > maxSize) {
                tempFilePath = null;
                that.$emit("onVideoSize", res);
                common_vendor.index.showToast({
                  title: `视频最大上传${that.videoFromData.size}MB`,
                  duration: 2e3,
                  icon: "none"
                });
              }
            }
            if (tempFilePath == null) {
              return false;
            }
            if (that.autoUpload) {
              that.updataFile(tempFilePath, "video");
            } else {
              that.FileList.push({
                url: tempFilePath,
                type: "video"
              });
              that.tempFile_paths.push(tempFilePath);
            }
          },
          fail(err) {
            console.error("选择视频失败", err);
          }
        });
      }
      if (this.fileType === 3) {
        Object.assign({}, this.imageFormData, this.this.videoFromData, {
          // 最多可以选择的图片张数，默认9
          count: 9,
          sizeType: ["original", "compressed"],
          // album 从相册选图，camera 使用相机，默认二者都有。
          sourceType: ["camera", "album"]
        });
        common_vendor.index.chooseMedia({
          count: 9,
          mediaType: ["image", "video"],
          sourceType: ["album", "camera"],
          maxDuration: 30,
          camera: "back",
          success(res) {
          }
        });
      }
    },
    /**
     * 上传文件到服务器
     * @param { tempFile } 文件临时地址
     * @param { filetype } 文件类型
     * */
    updataFile(tempFile, filetype) {
      const that = this;
      that.$emit("afterUpload", tempFile, filetype);
      common_vendor.index.showLoading({
        title: "正在上传中...",
        icon: "loading"
      });
      return new Promise(async (resolve) => {
        if (that.action === "uniCloud") {
          await common_vendor.Ds.uploadFile({
            cloudPath: Date.now() + (filetype === "image" ? ".png" : ".mp4"),
            filePath: tempFile,
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                progressEvent.loaded * 100 / progressEvent.total
              );
              that.$emit("onProgress", percentCompleted);
            },
            success(result) {
              that.FileList.push(result.fileID);
              common_vendor.index.hideLoading();
              that.$emit("onProgress", {
                ...result
              });
            },
            fail: (error) => {
              common_vendor.index.hideLoading();
              console.error("error", error);
              that.$emit("onError", error);
            }
          });
          return false;
        }
        const uploadTask = common_vendor.index.uploadFile({
          url: that.action,
          filePath: tempFile,
          name: that.fileName,
          formData: that.data,
          header: that.headers,
          success: (uploadFileRes) => {
            const data = JSON.parse(uploadFileRes.data);
            common_vendor.index.hideLoading();
            that.success(data);
            resolve(data);
          },
          fail: (error) => {
            common_vendor.index.hideLoading();
            console.error("error", error);
            that.$emit("onError", error);
          }
        });
        uploadTask.onProgressUpdate((res) => {
          that.$emit("onProgress", {
            ...res,
            ...tempFile
          });
        });
      });
    },
    /**
     * 手动上传
     * */
    submit() {
      return new Promise((resolve) => {
        if (this.tempFile_paths.length <= 0) {
          this.success([]);
          return console.error("没有可上传文件");
        }
        const promises = this.tempFile_paths.map((item) => {
          return this.updataFile(item);
        });
        Promise.all(promises).then((reslut) => {
          this.tempFile_paths = [];
          this.success(reslut);
          resolve(reslut);
        });
      });
    },
    /**
     * 返回数据
     * */
    success(data) {
      this.$emit("onSuccess", data);
    },
    /**
     * 压缩图片
     * @param {array} tempFilePaths 临时路径数组
     * @return {array} 被压缩过的路径数组
     * */
    async compressImage(tempFilePaths) {
      const that = this;
      return new Promise((resolve) => {
        if (tempFilePaths.length <= 0) {
          console.error("压缩数组不能为空");
          resolve([]);
        }
        const promiseImages = (item) => {
          return new Promise((resol) => {
            common_vendor.index.compressImage({
              src: item.path,
              quality: that.imageFormData.quality || 80,
              success: (res) => {
                console.log(res);
                resol(res.tempFilePath);
              },
              fail(err) {
                console.log("压缩失败", err);
                resol(err);
              }
            });
          });
        };
        const compressImages = tempFilePaths.map((item) => {
          return promiseImages(item);
        });
        common_vendor.index.showLoading({
          title: "压缩中...",
          icon: "loading"
        });
        Promise.all(compressImages).then((res) => {
          console.log(res);
          common_vendor.index.hideLoading();
          resolve(res);
        }).catch((err) => {
          common_vendor.index.hideLoading();
          resolve(err);
        });
      });
    },
    /**
     * H5压缩图片质量
     * */
    canvasDataURL(path, obj, callback) {
      var img = new Image();
      img.src = path;
      img.onload = function() {
        var that = this;
        var w = that.width, h = that.height, scale = w / h;
        w = obj.width || w;
        h = obj.height || w / scale;
        var quality = 0.8;
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        var anw = document.createAttribute("width");
        anw.nodeValue = w;
        var anh = document.createAttribute("height");
        anh.nodeValue = h;
        canvas.setAttributeNode(anw);
        canvas.setAttributeNode(anh);
        ctx.drawImage(that, 0, 0, w, h);
        if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
          quality = obj.quality;
        }
        var base64 = canvas.toDataURL("image/jpeg", quality);
        callback(base64);
      };
    },
    /**
     * 预览图片
     * @param {string, object} item 文件信息
     * */
    previewImage(item) {
      const that = this;
      if (that.fileUrlType(item) === "video" || item.type === "video")
        return false;
      if (!that.isPreviewImage)
        return false;
      const imgs = that.FileList.filter((item2) => {
        return that.fileUrlType(item2) !== "video" && item2.type !== "video";
      }).map((item2) => (item2 == null ? void 0 : item2.url) ?? item2);
      const current = imgs.indexOf(item || item.url);
      console.log("预览1", imgs, current);
      common_vendor.index.previewImage({
        current,
        urls: imgs,
        success() {
          console.log("预览");
        },
        fail(err) {
          console.log(err);
        }
      });
    },
    /**
     * 预览视频
     * @param {string, object} item 文件信息
     * */
    onPlay(item, index) {
      this.$emit("onVideo", {
        item,
        index
      });
      this.tempVideoUrl = item.url || item;
    },
    /**
     * 是否img类型
     * @param {string, object} item 文件信息
     * */
    fileUrlType(item) {
      if (!item) {
        console.error("列表文件尾缀或地址错误");
        return false;
      }
      const url = item.url || item.path || item || false;
      const IMAGE_REGEXP = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg|image)/i;
      if (IMAGE_REGEXP.test(url) || this.isBase64(url)) {
        return "image";
      } else {
        return "video";
      }
    },
    isBase64(str) {
      return str.includes("data:image/jpeg;base64,") || str.includes("blob:");
    }
  }
};
if (!Array) {
  const _easycom_cl_image2 = common_vendor.resolveComponent("cl-image");
  _easycom_cl_image2();
}
const _easycom_cl_image = () => "../cl-image/cl-image.js";
if (!Math) {
  _easycom_cl_image();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.FileList, (item, index, i0) => {
      return common_vendor.e({
        a: $options.fileUrlType(item) === "image"
      }, $options.fileUrlType(item) === "image" ? {
        b: item.url || item,
        c: common_vendor.s($options.imgStyle)
      } : common_vendor.e({
        d: !$props.autoUpload || $props.cloudType === "other"
      }, !$props.autoUpload || $props.cloudType === "other" ? {
        e: $data.playImg,
        f: common_vendor.o(($event) => $options.onPlay(item, index), index),
        g: common_vendor.s($options.imgStyle),
        h: item.url || item
      } : {
        i: common_vendor.s($options.imgStyle),
        j: "30f1beb2-0-" + i0,
        k: common_vendor.p({
          cloudType: $props.cloudType,
          src: item.url || item
        })
      }, {
        l: $data.playImg,
        m: common_vendor.o(($event) => $options.onPlay(item, index), index),
        n: common_vendor.s($options.imgStyle)
      }), $props.remove ? {
        o: $data.deleteImg,
        p: common_vendor.o(($event) => $options.onRemove(item, index), index)
      } : {}, {
        q: common_vendor.o(($event) => $options.onClickRow(item, index), index),
        r: index
      });
    }),
    b: $props.remove,
    c: common_vendor.s($options.rowStyle),
    d: $props.add && $data.FileList.length < $props.max
  }, $props.add && $data.FileList.length < $props.max ? {
    e: $data.addImg,
    f: common_vendor.o((...args) => $options.onClickAdd && $options.onClickAdd(...args)),
    g: common_vendor.s($options.rowStyle)
  } : {}, {
    h: common_vendor.s($options.listRowStyle),
    i: $data.tempVideoUrl
  }, $data.tempVideoUrl ? {
    j: common_vendor.o(($event) => $data.tempVideoUrl = ""),
    k: $data.closeImg,
    l: $data.tempVideoUrl,
    m: common_vendor.o(() => {
    })
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-30f1beb2"], ["__file", "D:/bj0517听书/配套资料/07-前端代码/ListenToBooks-master/uni_modules/cl-upload/components/cl-upload/cl-upload.vue"]]);
wx.createComponent(Component);
