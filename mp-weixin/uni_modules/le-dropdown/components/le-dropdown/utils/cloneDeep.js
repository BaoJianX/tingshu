"use strict";
function deepClone(obj) {
  let result = typeof obj.splice === "function" ? [] : {};
  if (obj && typeof obj === "object") {
    for (let key in obj) {
      if (obj[key] && typeof obj[key] === "object") {
        result[key] = deepClone(obj[key]);
      } else {
        result[key] = obj[key];
      }
    }
    return result;
  }
  return obj;
}
exports.deepClone = deepClone;
