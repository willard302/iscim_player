import type { PlayerStoreState } from "~/types/data.types"

export const usePlayerStore = defineStore("player", () => {

  const state = reactive<PlayerStoreState>({
    isPlaying:false,
    src: "",
    index: -1,
    volume: 100,
    volume_on: true,
    loop: "normal",
    currentSec: 0,
    currentTime: "00:00",
    duration: 0,
    duraTime: "00:00"
  })

  const resetPlayer = () => {
    state.src = "";
    state.index = -1;
    state.currentSec = 0;
    state.currentTime = "00:00";
    state.duration = 0;
    state.duraTime = "00:00"
  }

  return {
    ...toRefs(state),
    resetPlayer
  }
},
{
  persist : true
})