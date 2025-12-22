import { useMenuStore } from "~/store/useMenuStore";
import { useMusicStore } from "~/store/useMusicStore";
import { usePlayerStore } from "~/store/usePlayerStore";
import type { ChakraType, Song } from "~/types/data.types";

export const usePlaylist = () => {
  
  const playerStore = usePlayerStore()
  const musicStore = useMusicStore();
  const menuStore = useMenuStore();
  const player = usePlayer();

  const addToLists = (item: Song) => {
    musicStore.queue.push(item);

    // 若尚未有歌曲 → 播第一首
    if (playerStore.index === -1) {
      player?.setSourceByIndex(0);
      player?.playMusic();
    };
  };

  const addMusic = (song:any, chakra?: any) => {
    const list = {
      id: song.id,
      name: song.name,
      src: song.src,
      index: playerStore.index,
      chakra: chakra 
        ? (musicStore.chakra.num === 99 ? chakra : chakra.num)
        : (musicStore.chakra.num || 0)
    };

    // 添加到播放列表
    addToLists(list);

    // 如果是第一首歌，立即加载
    if (musicStore.name === "Hints.select_music") {
      console.log(list)
      musicStore.name = list.name;
      playerStore.src = list.src;
    };
  };

  const loadSongSets = (musicList:any, chakraList: number[]) => {
    console.log(musicList, chakraList)
    const {idx: startIdx, num: chakraNum} = musicStore.chakra;
    let chakraIndex = startIdx;
    
    const sourceChakraList = 
      chakraNum === 99
        ? (chakraList.length ? chakraList : (musicList.chakra || []))
        : [];
    
    const getNextChakra = () => {
      if (sourceChakraList.length === 0) return 0;

      const c = sourceChakraList[chakraIndex];
      chakraIndex = (chakraIndex + 1) % sourceChakraList.length;
      return c;
    };

    musicList.content.forEach((song:any) => {
      const chakra = getNextChakra();
      addMusic(song, chakra);
    })
  };

  const saveSet = (newSetName: string) => {
    musicStore.initNewSet();
    musicStore.name = newSetName;
    musicStore.queue.forEach((e) => {
      musicStore.newSet.content.push({
        name: e.name,
        id: e.name,
        src: e.src
      });
      if (e.chakra) musicStore.newSet.chakra.push(e.chakra);
    });
    
    // 添加到自定义集合中
    musicStore.subSet
      .find(set => set.name === 'Set.custom')
      .menu.push(musicStore.newSet);
  };

  const removeSet = (item: any) => {
    musicStore.subSet
      .find(set => set.name === item.name)
      .menu.splice(item.index, 1);
  };

  const removeMusic = (music:any, musicSelected: any) => {
    if (music.order > musicSelected.order) {
      music.order--;
    } else if (music.order === musicSelected.order) {
      music.order = null;
    };
  };

  const addChakra = (item: ChakraType) => {
    musicStore.chakra.name = item.name;
    musicStore.chakra.num = item.idx;
    menuStore.openMenu = 'off';
  };

  return {
    addToLists,
    addMusic,
    addChakra,
    loadSongSets,
    saveSet,
    removeSet,
    removeMusic
  }
}
