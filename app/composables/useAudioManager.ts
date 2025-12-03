let audioInstance: HTMLAudioElement | null = null;

export const useAudioManager = () => {
  const getAudio = (): HTMLAudioElement => {
    // 確保在客戶端執行
    if (typeof window === "undefined") return null as any;

    if (!audioInstance) {
      audioInstance = new Audio();
      audioInstance.preload = "auto";
      audioInstance.crossOrigin = "anonymous";
    }
    return audioInstance
  };

  const destroyAudio = () => {
    if (audioInstance) {
      audioInstance.pause();
      audioInstance.src = "";
      audioInstance = null;
    }
  };

  return {
    getAudio,
    destroyAudio
  }

}
