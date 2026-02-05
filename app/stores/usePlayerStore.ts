import type { PlayerStoreState } from "~/types/data.types";
import type { MusicLocal } from "~/types/supabase";
import { reactive } from "vue";

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

  const setExpand = (status: boolean) => {
    state.isExpanded = status
  };

  return {
    ...toRefs(state),
    resetPlayer,
    setExpand
  }
},
{
  persist: {
    afterHydrate: (ctx: any) => {
      ctx.store.isPlaying = false;
      ctx.store.isExpanded = false;
    }
  }
})