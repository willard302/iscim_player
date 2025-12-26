import type { PlayerStoreState } from "~/types/data.types";

const defaultState = (): PlayerStoreState => ({
  isPlaying: false,
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
  }

  return {
    ...toRefs(state),
    resetPlayer
  }
},
{
  persist : {
    storage: localStorage
  }
})