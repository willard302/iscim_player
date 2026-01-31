import type { ChakraType } from "~/types/data.types";
import type { MusicInsert, MusicRow, SetInsert, SetRow } from "~/types/supabase";

export const usePlaylist = () => {
  
  const playerStore = usePlayerStore()
  const musicStore = useMusicStore();
  const mainStore = useMainStore();
  const player = usePlayer();
  const {removeSetFromDb} = useDataBase();
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

    // 添加到播放列表
    addToLists(list);

    // 如果是第一首歌，立即加载
    if (musicStore.name === "Hints.select_music") {
      musicStore.name = list.name;
    };
  };

  const loadMusicSet = (musicList: SetInsert) => {
    const sourceChakraList = (musicList.chakras && musicList.chakras.length > 0 && !musicList.chakras.includes(99))
      ? musicList.chakras : [];
      
    let chakraIndex = 0;
    const getNextChakra = () => {
      if (sourceChakraList.length === 0) return 0;
      const c = sourceChakraList[chakraIndex];
      chakraIndex = (chakraIndex + 1) % sourceChakraList.length;
      return c;
    };

    if (Array.isArray(musicList.content)) {
      musicList.content.forEach((song) => {
        const chakra = getNextChakra();
        addMusic(song as MusicRow, chakra);
      })
    };
  };

  const saveSet = async() => {
    const {insertSet} = useDataBase();

    musicStore.newSet.category = 'custom';
    musicStore.newSet.created_by = mainStore.userInfo.name;
    musicStore.newSet.is_pro = true;
    musicStore.newSet.content = JSON.stringify([]);


    const result = await insertSet(musicStore.newSet);
    console.log(result)
    musicStore.currentSet = musicStore.newSet;
    musicStore.setPlayerSet(true);
    // musicStore.initNewSet();
  };

  const removeSet = async(setId: string) => {
    const sets_custom = musicStore.subSet.find(item => item.id === 'custom');
    const idx = sets_custom?.menu.findIndex(s => s.id === setId);
    if (!idx || idx === -1) return;
    sets_custom?.menu.splice(idx, 1);
    const res = await removeSetFromDb(setId);
    if (res === 204) showSuccessToast(t(`Toast.removed_successfully`))
  };

  const removeMusic = (music:any) => {
  
    console.log(music)
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
    removeMusic,
    removeAllFromQueue
  }
}
