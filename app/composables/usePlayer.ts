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

  const updateMediaSession = () => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;

    const song = musicStore.queue[playerStore.index];
    if (!song) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.name,
      artist: song.created_by || 'Unknown Artist',
    });

    navigator.mediaSession.setActionHandler("play", playMusic)
    navigator.mediaSession.setActionHandler("pause", playMusic)
    navigator.mediaSession.setActionHandler("previoustrack", playMusic)
    navigator.mediaSession.setActionHandler("nexttrack", playMusic)
  };
  
  // 初始化監聽器 (保證只執行一次)
  const initListeners = () => {
    const audio = getAudio();
    if (!audio) return;

    audio.ontimeupdate = null;
    audio.onended = null;
    audio.onerror = null;

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
      };
      updateMediaSession();
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
          if (!isLast) return next();
          playerStore.isPlaying = false;
          playerStore.currentSec = 0;
          musicStore.slidePercent = 0;
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
    playerStore.currentSong = item;

    const audio = getAudio();
    if (!audio) return false;

    if (audio.src !== item.src) {
      audio.src = item.src;
      audio.load();
    };

    updateMediaSession();
    return true;
  };

  const playMusic = async() => {
    const audio = getAudio();
    if (!audio) return;

    if (!audio.src && musicStore.queue.length > 0) {
      setSourceByIndex(playerStore.index || 0);
    };

    try {
      await audio.play();
      playerStore.isPlaying = true;
      updateMediaSession();
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

  const onSeekEnd = (value: number) => {
    const audio = getAudio();
    if (!audio || !isFinite(audio.duration)) return;

    const time = (value / 100) * audio.duration;
    audio.currentTime = time;
    musicStore.isDragging = false;
    if (!playerStore.isPlaying) playMusic();
  }

  const onSeeking = (value: number) => {
    musicStore.isDragging = true;
    const audio = getAudio();
    if (audio && audio.duration) {
      const time = (value / 100) * audio.duration;
      playerStore.currentTime = formatTime(time);
    }
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

  return {
    initListeners,
    playMusic,
    pauseMusic,
    togglePlay,
    playIndex,
    next,
    prev,
    onSeekEnd,
    onSeeking,
    setVolume,
    openVolume,
    setSourceByIndex
  }
}
