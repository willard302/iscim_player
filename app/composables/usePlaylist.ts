import type { ChakraType } from "~/types/data.types";
import type { MusicRow, SetInsert, SetRow } from "~/types/supabase";

export const usePlaylist = () => {
  
  const playerStore = usePlayerStore()
  const musicStore = useMusicStore();
  const menuStore = useMenuStore();
  const mainStore = useMainStore();
  const player = usePlayer();

  const addToLists = (item: any) => {
    musicStore.queue.push(item);

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
    console.log(musicList)
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
    menuStore.isJuniorMenu = false;
    menuStore.isMusicList = true;
  };

  const saveSet = (newSetName: string) => {
    if (!newSetName) return;

    musicStore.initNewSet();
    musicStore.newSet.name = newSetName;
    musicStore.newSet.category = 'custom';

    musicStore.queue.forEach((e: any) => {

      const musicItem: MusicRow = {
        id: e.id,
        name: e.name,
        src: e.src,
        intro: e.intro || null,
        category: e.category || 'custom',
        created_at: e.created_at || new Date().toISOString(),
        created_by: e.created_by || ''
      };

      musicStore.newSet.content.push(musicItem)

      if (e.chakra) musicStore.newSet.chakras?.push(e.chakra);
    });
  };

  const removeSet = (item: SetRow) => {
    const idx = musicStore.subSet.findIndex(s => s.id === item.id);
    if (idx > -1) musicStore.subSet.splice(idx, 1);
  };

  const removeMusic = (music:any, musicSelected: any) => {
    if (music.sort_order > musicSelected.order) {
      music.sort_order--;
    } else if (music.sort_order === musicSelected.order) {
      music.sort_order = null;
    };
  };

  const addChakra = (item: ChakraType) => {
    musicStore.chakra = item;
    menuStore.openMenu = "";
    menuStore.toggleAdvanceMenu();
  };

  return {
    addToLists,
    addMusic,
    addChakra,
    loadMusicSet,
    saveSet,
    removeSet,
    removeMusic
  }
}
