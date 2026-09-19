"use strict";
function handleQuery(callback) {
  try {
    setTimeout(function() {
      _getApp().globalData.zp_handleQueryCallback = callback;
    }, 1);
  } catch (e) {
  }
}
function _handleQuery(pageNo, pageSize, from) {
  const handleQueryCallback = _getApp().globalData.zp_handleQueryCallback;
  if (handleQueryCallback) {
    return handleQueryCallback(pageNo, pageSize, from);
  }
  return [pageNo, pageSize, from];
}
function handleLanguage2Local(callback) {
  try {
    setTimeout(function() {
      _getApp().globalData.zp_handleLanguage2LocalCallback = callback;
    }, 1);
  } catch (e) {
  }
}
function _handleLanguage2Local(language, local) {
  const handleLanguage2LocalCallback = _getApp().globalData.zp_handleLanguage2LocalCallback;
  if (handleLanguage2LocalCallback) {
    return handleLanguage2LocalCallback(language, local);
  }
  return local;
}
function _getApp() {
  return getApp();
}
const interceptor = {
  handleQuery,
  _handleQuery,
  handleLanguage2Local,
  _handleLanguage2Local
};
exports.interceptor = interceptor;
