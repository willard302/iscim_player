import type { MusicLocal, PlayerStoreState } from "~/types/data.types";

const defaultState = (): PlayerStoreState => ({
  isPlaying: false,
  isExpanded: false,
  currentSong: {} as MusicLocal,
  src: "",
  index: 0,
  volume: 100,
  volume_on: true,
  loop: "normal",
  currentSec: 0,
  currentTime: "00:00",
  duration: 0,
  duraTime: "00:00"
});

export const usePlayerStore = defineStore("player", () => {

  const state = reactive<PlayerStoreState>(defaultState());

  const resetPlayer = () => {
    Object.assign(state, defaultState());
  };

  const toggleExpand = () => {
    state.isExpanded = !state.isExpanded;
  };

  const setExpand = (status: boolean) => {
    state.isExpanded = status
  };

  return {
    ...toRefs(state),
    resetPlayer,
    toggleExpand,
    setExpand
  }
},
{
  persist : true
})