import type { MusicStoreState } from "~/types/data.types";

export const useMusicStore = defineStore("music", {
  state: (): MusicStoreState => ({
    type: "pro",
    title: "Hints.select_music",
    src: "",
    lists: [],
    index: -1,
    status: false,
    mode: 0, // normal = 0 ; repeatOne = 1 ; repeatAll = 2;
    currentTime: "00:00",
    duraTime: "00:00",
    item: null,
    subMusic: [
      
    ],
    subMusicUpdated: [],
    subSet: [],
    chakra: {
      name: "enhance",
      num: -1,
      idx: 0,
      lists: []
    }
  }),
  persist: true
})