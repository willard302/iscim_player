import { useMusicStore } from "~/store/useMusicStore";
import { usePlayerStore } from "~/store/usePlayerStore";

export const usePlayer = () => {
  const {formatTime} = useCommon();
  const musicStore = useMusicStore();
  const playerStore = usePlayerStore();
  const {getAudio} = useAudioManager();
  
  // 初始化監聽器 (保證只執行一次)
  const initListeners = () => {
    const audio = getAudio();
    if (!audio) return;

    // 移除舊的監聽器避免重複 (可選，視乎調用時機)
    audio.ontimeupdate = null;
    audio.onended = null;
    audio.onloadedmetadata = null;
    audio.onerror = null;

    audio.ontimeupdate = () => {
      const cur = audio.currentTime;
      playerStore.currentSec = cur;
      playerStore.currentTime = formatTime(cur);

      if (audio.duration) {
        musicStore.slidePercent = (cur / audio.duration) * 100;
        musicStore.diskRotation = (cur / audio.duration) * 360 * 3;
      }
    };

    audio.onloadedmetadata = () => {
      const dur = audio.duration;
      playerStore.duration = dur;
      playerStore.duraTime = formatTime(dur);

      audio.volume = playerStore.volume_on ? (playerStore.volume / 100) : 0;
    };

    audio.onended = () => {
      pauseMusic();

      const isLast = playerStore.index >= musicStore.queue.length - 1;

      switch(playerStore.loop) {
        case "normal":
          next();
          break;
        case "repeatOne":
          playMusic();
          break;
        case "repeatAll":
          playerStore.index = isLast ? 0 : playerStore.index++;
          playIndex(playerStore.index);
          break;
      }
    };

    audio.onerror = (e) => {
      console.error("Audio Playback Error", e);
      playerStore.isPlaying = false;
    };
  };

  const setSourceByIndex = (i: number) => {
    if (i < 0 || i >= musicStore.queue.length) return false;
    const item = musicStore.queue[i];
    if (!item) return;

    playerStore.index = i;
    playerStore.src = item.src;
    musicStore.title = item.title || 'Please Select Music';

    const audio = getAudio();
    if (!audio) return;
    audio.src = item.src;
    audio.load();

    return true;
  };

  const playMusic = async() => {
    console.log("playMusic");
    const audio = getAudio();
    if (!audio) return;

    if (!audio.src && musicStore.queue.length > 0) {
      setSourceByIndex(0);
    };

    try {
      await audio.play();
      playerStore.isPlaying = true;
    } catch (error) {
      console.warn("Autoplay revented or load error: ", error);
      playerStore.isPlaying = false;
    };
  };

  const pauseMusic = () => {
    console.log("pauseMusic")
    const audio = getAudio();
    if (!audio) return;
    audio.pause();
    playerStore.isPlaying = false;
  };

  const togglePlay = () => {
    playerStore.isPlaying ? pauseMusic() : playMusic();
  };

  const playIndex = (i: number) => {
    if (setSourceByIndex(i)) {
      playMusic();
    }
  };

  const next = () => {
    if (!musicStore.queue.length) return;
    pauseMusic();
    const ni = (playerStore.index + 1) % musicStore.queue.length;
    playIndex(ni);
  };

  const prev = () => {
    if (!musicStore.queue.length) return;
    pauseMusic();
    const pi = (playerStore.index - 1 + musicStore.queue.length) % musicStore.queue.length;
    playIndex(pi);
  };

  const setVolume = (v: number) => {
    const audio = getAudio();

    const volume = Math.max(0, Math.min(100,v));
    playerStore.volume = volume;
    if (audio && playerStore.volume_on) {
      audio.volume = volume / 100;
    };
  };

  const openVolume = () => {
    const audio = getAudio();
    playerStore.volume_on = !playerStore.volume_on;
    if (!audio) return;
    const volume = playerStore.volume_on ? 100 : 0;
    playerStore.volume = volume;
    audio.volume = volume / 100;

  };

  const seek = (percent: number) => {
    const audio = getAudio();
    if (!audio || !isFinite(audio.duration)) return;

    const time = (percent / 100) * audio.duration;
    audio.currentTime = time;

    musicStore.slidePercent = percent;
  };

  return {
    initListeners,
    playMusic,
    pauseMusic,
    togglePlay,
    playIndex,
    next,
    prev,
    setVolume,
    openVolume,
    seek,
    setSourceByIndex
  }
}
