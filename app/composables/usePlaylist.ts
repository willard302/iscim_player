import { useMenuStore } from "~/store/useMenu";
import { useMusicStore } from "~/store/useMusicStore";
import { usePlayerStore } from "~/store/usePlayerStore";
import type { chakraItem, MusicSetList, Song } from "~/types/data.types";

export const usePlaylist = () => {
  
  const playerStore = usePlayerStore()
  const musicStore = useMusicStore();
  const menuStore = useMenuStore();
  const player = usePlayer();

  const addToLists = (item:Song) => {
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
      title: song.name,
      src: song.src,
      index: playerStore.index,
      chakra: chakra 
        ? (chakra.num === 99 ? chakra : chakra.num)
        : (musicStore.chakra.num || 0)
    };

    // 添加到播放列表
    addToLists(list);

    // 如果是第一首歌，立即加载
    if (musicStore.title === "Please Select Music") {
      musicStore.title = list.title;
      playerStore.src = list.src;
    };
  };

  const loadSongSets = (musicList:any, chakraList = []) => {
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

  const saveSet = (newSet: string) => {
    let newList: MusicSetList = {
      name: newSet,
      amount: musicStore.queue.length - 1,
      intro: "",
      content: [],
      chakra: []
    };

    musicStore.queue.forEach((e) => {
      newList.content.push({
        title: e.title,
        src: e.src
      });
      if (e.chakra) newList.chakra.push(e.chakra);
    });
    
    // 添加到自定义集合中
    musicStore.subSet
      .find(set => set.name === 'Set.custom')
      .menu.push(newList);
  };

  const removeSet = (item: any) => {
    musicStore.subSet
      .find(set => set.name === item.name)
      .menu.splice(item.index, 1);
  };

  const addChakra = (item:chakraItem) => {
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
    removeSet
  }
}
