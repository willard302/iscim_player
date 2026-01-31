import type { ChakraType, MusicLocal } from "~/types/data.types";
import type { MusicInsert, MusicRow, MusicUpdate, SetInsert, SetRow } from "~/types/supabase";

export const usePlaylist = () => {
  
  const playerStore = usePlayerStore()
  const musicStore = useMusicStore();
  const mainStore = useMainStore();
  const player = usePlayer();
  const {removeSetFromDb, updateSetToDb} = useDataBase();
  const {t} = useI18n();

  const addToLists = (item: any) => {
    musicStore.queue.unshift(item);
    // 若尚未有歌曲 → 播第一首
    if (playerStore.index === -1) {
      player?.setSourceByIndex(0);
    };
  };

  const addMusic = (song:MusicRow, chakra?: number) => {
    if (!song || !song.src) {
      console.warn("Invalid song data:", song);
      return;
    };

    const list = {
      ...song,
      index: musicStore.queue.length,
      chakra: chakra ?? (musicStore.chakra.num === 99 ? 0 : musicStore.chakra.num || 0),
      created_by: mainStore.userInfo.name || 'System'
    };

    addToLists(list);

    if (musicStore.name !== "Hints.select_music") return;
    musicStore.name = list.name;
  };

  const loadMusicSet = (musicList: SetInsert) => {
    const content = Array.isArray(musicList.content) ? musicList.content : [];

    if (content.length === 0) return;

    const sourceChakraList = (musicList.chakras && musicList.chakras.length > 0 && !musicList.chakras.includes(99))
      ? musicList.chakras : [];
      
    let chakraIndex = 0;
    const getNextChakra = () => {
      if (sourceChakraList.length === 0) return 0;
      const c = sourceChakraList[chakraIndex];
      chakraIndex = (chakraIndex + 1) % sourceChakraList.length;
      return c;
    };

    content.forEach((song) => {
      const chakra = getNextChakra();
      addMusic(song as MusicRow, chakra);
    })
  };

  const saveSet = async() => {
    if (!musicStore.newSet.name) return showFailToast(t("Hints.input_set_name"));

    const payload = {
      ...musicStore.newSet,
      category: 'custom',
      created_by: mainStore.userInfo.name || 'System',
      is_pro: true,
      chakras: musicStore.newSet.chakras ?? [],
      content: typeof musicStore.newSet.content === 'string'
        ? musicStore.newSet.content
        : JSON.stringify(musicStore.newSet.content ?? [])
    };

    try {
      const {insertSet} = useDataBase();
      const newSet = await insertSet(payload);

      if (!newSet) return;
      musicStore.currentSet = newSet;

      const sets_custom = musicStore.subSet.find(g => g.id === 'custom');
      if (sets_custom) sets_custom.menu.push(newSet);
      musicStore.setPlayerSet(true);
    } catch (error) {
      showFailToast(t("Save failed"))
    }
  };

  const removeSet = async(setId: string) => {
    try {
      const res = await removeSetFromDb(setId);
      if (res !== 204) return;
      const sets_custom = musicStore.subSet.find(item => item.id === 'custom');
      if (sets_custom) {
        const idx = sets_custom?.menu.findIndex(s => s.id === setId);
        if (idx === -1) sets_custom.menu.splice(idx, 1);
      }
      showSuccessToast(t(`Toast.removed_successfully`))
    } catch (error) {
      showFailToast(t("Toast.delete_failed"));
    }   
  };

  const removeMusicFromSet = async(musicToRemove: any) => {
    if (!musicStore.currentSet || !musicStore.currentSet.id) return;

    const currentContent = musicStore.currentSet.content as any[];

    const newContent = currentContent.filter(song => song.src !== musicToRemove.src);

    if (newContent.length === currentContent.length) return;

    musicStore.currentSet.content = newContent;

    try {
      await updateSetToDb(musicStore.currentSet.id, {
        content: newContent
      });
      showSuccessToast(t('Toast.removed_successfully'));
    } catch (error) {
      console.error(error);
      showFailToast('update failed.')
    };
  };

  const removeMusicFromQueue = (music: MusicLocal) => {
    const currentQueue = musicStore.queue;
    if (currentQueue.length === 0) return showToast('no more music in queue');
    const index = currentQueue.findIndex(item => item.src === music.src);
    if (index === -1) return;
    currentQueue.splice(index, 1);
    player.setSourceByIndex(index);
  };

  const removeAllFromQueue = () => {
    musicStore.resetMusic();
    playerStore.resetPlayer();
  };

  const addChakra = (item: ChakraType) => {
    musicStore.chakra = item;
  };

  return {
    addToLists,
    addMusic,
    addChakra,
    loadMusicSet,
    saveSet,
    removeSet,
    removeMusicFromSet,
    removeMusicFromQueue,
    removeAllFromQueue
  }
}
