"use strict";
const common_vendor = require("../../../../../common/vendor.js");
let config = null;
let getedStorage = false;
const storageKey = "Z-PAGING-CONFIG-STORAGE-KEY";
function setConfig(value) {
  common_vendor.index.setStorageSync(storageKey, value);
}
function getConfig() {
  if (getedStorage)
    return config;
  config = common_vendor.index.getStorageSync(storageKey);
  getedStorage = true;
  return config;
}
const zConfig = {
  setConfig,
  getConfig
};
exports.zConfig = zConfig;
