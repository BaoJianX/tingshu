"use strict";
const common_vendor = require("../common/vendor.js");
const utils_constant = require("./constant.js");
function recursionTree(data, key, value, childrenName = "children", joinPropName) {
  data.forEach((item) => {
    if (item[value]) {
      item[key] = item[value];
      delete item[value];
    }
    if (joinPropName) {
      item[key] = item[key] + "|" + item[joinPropName];
    }
    if (item[childrenName]) {
      recursionTree(item[childrenName], key, value, childrenName, joinPropName);
    }
  });
}
function getAllParentArr(list, id, idName = "id", childName = "children") {
  for (let i in list) {
    if (list[i][idName] == id) {
      return [list[i]];
    }
    if (list[i][childName]) {
      let node = getAllParentArr(list[i][childName], id, idName, childName);
      if (!!node) {
        return node.concat(list[i]);
      }
    }
  }
}
function formatTime(durationSeconds) {
  let seconds;
  if (typeof durationSeconds === "string") {
    seconds = Math.round(Number(durationSeconds));
  } else {
    seconds = Math.round(durationSeconds);
  }
  if (isNaN(seconds)) {
    return "00:00";
  }
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(seconds % 3600 / 60);
  const remSeconds = seconds % 60;
  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remSeconds.toString().padStart(2, "0")}`;
  } else {
    return `${minutes.toString().padStart(2, "0")}:${remSeconds.toString().padStart(2, "0")}`;
  }
}
function getCurrentPageInfo() {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  let returnObj = {
    route: `/${currentPage.route}`,
    pageInfo: currentPage,
    fullPath: ""
  };
  setTimeout(() => {
    returnObj.fullPath = currentPage.$page.fullPath;
  }, 0);
  return returnObj;
}
function getNameByValue(arr, value) {
  const item = arr.find((item2) => item2.value === value);
  return item ? item.name : null;
}
function myThrottle(fn, delay, options) {
  let lastTime = 0;
  let timer;
  const resultFn = function(...args) {
    const currentTime = Date.now();
    if (!lastTime && (options == null ? void 0 : options.leading) === false) {
      lastTime = currentTime;
    }
    const remainingTime = delay - (currentTime - lastTime);
    if (remainingTime <= 0 || remainingTime > delay) {
      if (timer) {
        clearTimeout(timer);
        timer = void 0;
      }
      lastTime = currentTime;
      fn.apply(this, args);
    } else if (!timer && (options == null ? void 0 : options.trailing) !== false) {
      timer = setTimeout(() => {
        lastTime = Date.now();
        timer = void 0;
        fn.apply(this, args);
      }, remainingTime);
    }
  };
  resultFn.cancel = function() {
    if (timer) {
      clearTimeout(timer);
      timer = void 0;
      lastTime = 0;
    }
  };
  return resultFn;
}
function setRedirectUrl() {
  const pageInfo = getCurrentPageInfo();
  console.log("pageInfo", pageInfo);
  setTimeout(() => {
    common_vendor.index.setStorageSync(utils_constant.REDIRECT_URL_KEY, encodeURIComponent(pageInfo.fullPath));
  }, 0);
}
function getRedirectUrl() {
  return decodeURIComponent(common_vendor.index.getStorageSync(utils_constant.REDIRECT_URL_KEY) || "");
}
function clearRedirectUrl() {
  common_vendor.index.removeStorageSync(utils_constant.REDIRECT_URL_KEY);
}
exports.clearRedirectUrl = clearRedirectUrl;
exports.formatTime = formatTime;
exports.getAllParentArr = getAllParentArr;
exports.getCurrentPageInfo = getCurrentPageInfo;
exports.getNameByValue = getNameByValue;
exports.getRedirectUrl = getRedirectUrl;
exports.myThrottle = myThrottle;
exports.recursionTree = recursionTree;
exports.setRedirectUrl = setRedirectUrl;
