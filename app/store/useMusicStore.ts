import type { MusicStoreState } from "~/types/data.types";
const {formatTime} = useCommon();
import { usePlayerStore } from "./usePlayerStore";


export const useMusicStore = defineStore("music", () => {

  const playerStore = usePlayerStore();

  const state = reactive<MusicStoreState>({
    type: "pro",
    title: "Hints.select_music",
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
    diskRotation: 0
  });

  const setLoop = () => {
    const modeList = ["normal", "repeatOne", "repeatAll"] as const;
    let modeIdx = modeList.indexOf(playerStore.loop);
    let nextMode = modeList[(modeIdx + 1) % modeList.length];
    if (!nextMode) return; 
    playerStore.loop = nextMode;
  };

  const resetSource = () => {
    state.title = "Please Select Music";
    playerStore.currentTime = "00:00";
    playerStore.src = "";
  };

  return {
    ...toRefs(state),
    setLoop,
    resetSource
  };
},
{
  persist: true
})