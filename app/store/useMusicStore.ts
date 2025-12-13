import type { MusicStoreState } from "~/types/data.types";
import { usePlayerStore } from "./usePlayerStore";


export const useMusicStore = defineStore("music", () => {

  const playerStore = usePlayerStore();

  const state = reactive<MusicStoreState>({
    type: "pro",
    name: "Hints.select_music",
    queue: [],
    item: null,
    subMusic: [],
    subMusicUpdated: [],
    subSet: [],
    chakra: {
      name: "enhance",
      num: -1,
      idx: 0,
      lists: []
    },
    slidePercent: 0,
    diskRotation: 0,
    isDragging: false
  });

  const setLoop = () => {
    const modeList = ["normal", "repeatOne", "repeatAll"] as const;
    let modeIdx = modeList.indexOf(playerStore.loop);
    let nextMode = modeList[(modeIdx + 1) % modeList.length];
    if (!nextMode) return; 
    playerStore.loop = nextMode;
  };

  const resetMusic = () => {
    state.name = "Please Select Music";
    state.queue = [];
    state.slidePercent = 0;
  };

  return {
    ...toRefs(state),
    setLoop,
    resetMusic
  };
},
{
  persist: true
})