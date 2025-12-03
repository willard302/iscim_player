export const usePlayerStore = defineStore("player", {
  state: () => ({
    isPlaying: false,
    src: "",
    index: -1,
    volume: 1,
    volume_on: true,
    loop: "normal" as "normal" | "repeatOne" | "repeatAll",
    currentTime: "00:00",
    currentSec: 0,
    duration: 0,
    duraTime: "00:00"
  }),
  persist: true
})