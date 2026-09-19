"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const uni_modules_zPaging_components_zPaging_js_zPagingConfig = require("./z-paging-config.js");
const uni_modules_zPaging_components_zPaging_config_index = require("../config/index.js");
const storageKey = "Z-PAGING-REFRESHER-TIME-STORAGE-KEY";
let config = null;
function gc(key, defaultValue) {
  if (!config) {
    if (uni_modules_zPaging_components_zPaging_config_index.zLocalConfig && Object.keys(uni_modules_zPaging_components_zPaging_config_index.zLocalConfig).length) {
      config = uni_modules_zPaging_components_zPaging_config_index.zLocalConfig;
    } else {
      const tempConfig = uni_modules_zPaging_components_zPaging_js_zPagingConfig.zConfig.getConfig();
      if (uni_modules_zPaging_components_zPaging_js_zPagingConfig.zConfig && tempConfig) {
        config = tempConfig;
      }
    }
  }
  if (!config)
    return defaultValue;
  const value = config[_toKebab(key)];
  return value === void 0 ? defaultValue : value;
}
function getTouch(e) {
  let touch = null;
  if (e.touches && e.touches.length) {
    touch = e.touches[0];
  } else if (e.changedTouches && e.changedTouches.length) {
    touch = e.changedTouches[0];
  } else if (e.datail && e.datail != {}) {
    touch = e.datail;
  } else {
    return {
      touchX: 0,
      touchY: 0
    };
  }
  return {
    touchX: touch.clientX,
    touchY: touch.clientY
  };
}
function getTouchFromZPaging(target) {
  if (target && target.tagName && target.tagName !== "BODY" && target.tagName !== "UNI-PAGE-BODY") {
    const classList = target.classList;
    if (classList && classList.contains("z-paging-content")) {
      return {
        isFromZp: true,
        isPageScroll: classList.contains("z-paging-content-page"),
        isReachedTop: classList.contains("z-paging-reached-top")
      };
    } else {
      return getTouchFromZPaging(target.parentNode);
    }
  } else {
    return { isFromZp: false };
  }
}
function getParent(parent) {
  if (!parent)
    return null;
  if (parent.$refs.paging)
    return parent;
  return getParent(parent.$parent);
}
function consoleErr(err) {
  console.error(`[z-paging]${err}`);
}
function setRefesrherTime(time, key) {
  const datas = getRefesrherTime() || {};
  datas[key] = time;
  common_vendor.index.setStorageSync(storageKey, datas);
}
function getRefesrherTime() {
  return common_vendor.index.getStorageSync(storageKey);
}
function getRefesrherTimeByKey(key) {
  const datas = getRefesrherTime();
  return datas && datas[key] ? datas[key] : null;
}
function getRefesrherFormatTimeByKey(key, textMap) {
  const time = getRefesrherTimeByKey(key);
  const timeText = time ? _timeFormat(time, textMap) : textMap.none;
  return `${textMap.title}${timeText}`;
}
function convertToPx(text) {
  const dataType = Object.prototype.toString.call(text);
  if (dataType === "[object Number]")
    return text;
  let isRpx = false;
  if (text.indexOf("rpx") !== -1 || text.indexOf("upx") !== -1) {
    text = text.replace("rpx", "").replace("upx", "");
    isRpx = true;
  } else if (text.indexOf("px") !== -1) {
    text = text.replace("px", "");
  }
  if (!isNaN(text)) {
    if (isRpx)
      return Number(common_vendor.index.upx2px(text));
    return Number(text);
  }
  return 0;
}
function getTime() {
  return new Date().getTime();
}
function getInstanceId() {
  const s = [];
  const hexDigits = "0123456789abcdef";
  for (let i = 0; i < 10; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 16), 1);
  }
  return s.join("") + getTime();
}
function _timeFormat(time, textMap) {
  const date = new Date(time);
  const currentDate = new Date();
  const dateDay = new Date(time).setHours(0, 0, 0, 0);
  const currentDateDay = new Date().setHours(0, 0, 0, 0);
  const disTime = dateDay - currentDateDay;
  let dayStr = "";
  const timeStr = _dateTimeFormat(date);
  if (disTime === 0) {
    dayStr = textMap.today;
  } else if (disTime === -864e5) {
    dayStr = textMap.yesterday;
  } else {
    dayStr = _dateDayFormat(date, date.getFullYear() !== currentDate.getFullYear());
  }
  return `${dayStr} ${timeStr}`;
}
function _dateDayFormat(date, showYear = true) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return showYear ? `${year}-${_fullZeroToTwo(month)}-${_fullZeroToTwo(day)}` : `${_fullZeroToTwo(month)}-${_fullZeroToTwo(day)}`;
}
function _dateTimeFormat(date) {
  const hour = date.getHours();
  const minute = date.getMinutes();
  return `${_fullZeroToTwo(hour)}:${_fullZeroToTwo(minute)}`;
}
function _fullZeroToTwo(str) {
  str = str.toString();
  return str.length === 1 ? "0" + str : str;
}
function _toKebab(value) {
  return value.replace(/([A-Z])/g, "-$1").toLowerCase();
}
const u = {
  gc,
  setRefesrherTime,
  getRefesrherFormatTimeByKey,
  getTouch,
  getTouchFromZPaging,
  getParent,
  convertToPx,
  getTime,
  getInstanceId,
  consoleErr
};
exports.u = u;
