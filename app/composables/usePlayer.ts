export const LoopMode = {
  NORMAL: "normal",
  ONE: "repeatOne",
  ALL: "repeatAll"
} as const;

export const usePlayer = () => {
  const { formatTime } = useCommon();
  const { getAudio } = useAudioManager();
  const musicStore = useMusicStore();
  const playerStore = usePlayerStore();
  
  // 初始化監聽器 (保證只執行一次)
  const initListeners = () => {
    const audio = getAudio();
    if (!audio) return;

    audio.ontimeupdate = () => {
      if (musicStore.isDragging) return // 如果正在拖曳進度條，暫不更新進度;

      const cur = audio.currentTime;
      playerStore.currentSec = cur;
      playerStore.currentTime = formatTime(cur);

      if (audio.duration) {
        musicStore.slidePercent = (cur / audio.duration) * 100;
      }
    };

    audio.onloadedmetadata = () => {
      const dur = audio.duration;
      playerStore.duration = dur;
      playerStore.duraTime = formatTime(dur);
      audio.volume = playerStore.volume_on ? (playerStore.volume / 100) : 0;

      if (playerStore.isPlaying) {
        audio.play().catch(e => console.warn("Auto-play blocked:", e));
      }
    };

    audio.onended = () => {
      const isLast = playerStore.index >= musicStore.queue.length - 1;

      switch(playerStore.loop) {
        case LoopMode.ONE:
          playIndex(playerStore.index);
          break;
        case LoopMode.ALL:
          next();
          break;
        case LoopMode.NORMAL:
        default:
          isLast ? (playerStore.isPlaying = false) : next();
          break;
      }
    };

    audio.onerror = (e) => {
      console.error("Audio Playback Error", e);
      playerStore.isPlaying = false;
    };
  };

  const setSourceByIndex = (i: number) => {
    const item = musicStore.queue[i];
    if (!item) return;

    playerStore.index = i;
    playerStore.src = item.src;
    musicStore.name = item.name;

    const audio = getAudio();
    if (!audio) return false;
    audio.src = item.src;
    audio.load();

    return true;
  };

  const playMusic = async() => {
    const audio = getAudio();
    if (!audio) return;

    if (!audio.src && musicStore.queue.length > 0) {
      setSourceByIndex(0);
    };

    try {
      await audio.play();
      playerStore.isPlaying = true;
    } catch (error) {
      console.warn("Play error: ", error);
      playerStore.isPlaying = false;
    };
  };

  const pauseMusic = () => {
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
    const ni = (playerStore.index + 1) % musicStore.queue.length;
    playIndex(ni);
  };

  const prev = () => {
    if (!musicStore.queue.length) return;
    const pi = (playerStore.index - 1 + musicStore.queue.length) % musicStore.queue.length;
    playIndex(pi);
  };

  const setVolume = (v: number) => {
    const audio = getAudio();
    const volume = Math.max(0, Math.min(100,v));
    playerStore.volume = volume;
    
    if (volume > 0) playerStore.volume_on = true;
    
    if (audio) {
      audio.volume = playerStore.volume_on ?  (volume / 100) : 0;
    };
  };

  const openVolume = () => {
    playerStore.volume_on = !playerStore.volume_on;
    if (playerStore.volume_on && playerStore.volume === 0) {
      playerStore.volume = 100;
    };
    setVolume(playerStore.volume);
  };

  const seek = (percent: number) => {
    const audio = getAudio();
    if (!audio || !isFinite(audio.duration)) return;

    const time = (percent / 100) * audio.duration;
    audio.currentTime = time;
    playerStore.currentTime = formatTime(time);
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
