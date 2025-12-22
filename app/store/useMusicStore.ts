import type { MusicStoreState, Song } from "~/types/data.types";
import { usePlayerStore } from "./usePlayerStore";


export const useMusicStore = defineStore("music", () => {
  
  const playerStore = usePlayerStore();

  const state = reactive<MusicStoreState>({
    isPro: false,
    name: "Hints.select_music",
    queue: [],
    item: null,
    subMusic: [],
    subMusicUpdated: [],
    subSet: [],
    chakra: {
      name: "enhance",
      num: 0,
      idx: 0,
      lists: []
    },
    newSet: {
      name: "",
      type: "custom",
      mode: "",
      chakra: {},
      content: []
    },
    slidePercent: 0,
    diskRotation: 0,
    isDragging: false,
    isLoaded: false
  });

  const setLoop = () => {
    const modeList = ["normal", "repeatOne", "repeatAll"] as const;
    let modeIdx = modeList.indexOf(playerStore.loop);
    let nextMode = modeList[(modeIdx + 1) % modeList.length];
    if (!nextMode) return; 
    playerStore.loop = nextMode;
  };

  const composeMusic = (musicList: Song[], musicClass: string) => {
    return musicList.map(music => ({
      ...music,
      name: `${musicClass} ${music.name}`
    }));
  };

  const resetMusic = () => {
    state.name = "Hints.select_music";
    state.queue = [];
    state.slidePercent = 0;
  };

  const initNewSet = () => {
    Object.assign(state.newSet, {
      name: "",
      type: "custom",
      mode: "",
      chakra: {},
      content: []
    })
  };

  const handleToggleType = () => {
    state.isPro = !state.isPro
  };

  return {
    ...toRefs(state),
    setLoop,
    composeMusic,
    resetMusic,
    initNewSet,
    handleToggleType
  };
},
{
  persist: true
})