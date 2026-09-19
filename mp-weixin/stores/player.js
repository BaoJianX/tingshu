"use strict";
const common_vendor = require("../common/vendor.js");
const usePlayerStore = common_vendor.defineStore("player", {
  state: () => ({
    playing: false,
    albumId: 0,
    trackId: 0
  }),
  actions: {
    changePlayStatus(status) {
      this.playing = status;
    },
    setId(state) {
      const { albumId, trackId } = state;
      this.albumId = albumId;
      this.trackId = trackId;
    }
  },
  persist: {
    enabled: true
  }
});
exports.usePlayerStore = usePlayerStore;
