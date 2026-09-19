"use strict";
const stores_user = require("../stores/user.js");
function useUpdateUserInfo() {
  const userStore = stores_user.useUserStore();
  const updateUserInfo = () => {
    if (userStore.token) {
      userStore.getUserInfo();
      userStore.getAccountBalance();
    }
  };
  return { updateUserInfo };
}
exports.useUpdateUserInfo = useUpdateUserInfo;
