import { useMusicStore } from "~/store/useMusic";
import type { chakraItem, MusicSetList } from "~/types/data.types";

export const usePlayer = () => {

  const musicStore = useMusicStore()

  const audio = new Audio();
  audio.preload = "metadata";

  const setSource = (song: any) => {
    musicStore.title = song.title,
    musicStore.src = song.src
  };

  const setSourceByIndex = (i: number) => {
    if (i < 0 || i >= musicStore.lists.length) return false;

    const item = musicStore.lists[i];
    if (!item) return;
    musicStore.index = i;
    musicStore.src = item.src;
    musicStore.title = item.title || 'Please Select Music';

    audio.src = item.src;
    audio.load();

    return true;
  };

  const playMusic = () => {
    if (!musicStore.src && musicStore.lists.length > 0) {
      setSourceByIndex(0)
    };
    audio.play();
    musicStore.status = true;
  };

  const pauseMusic = () => {
    audio.pause();
    musicStore.status = false;
  };

  const togglePlay = () => {
    musicStore.status ? pauseMusic() : playMusic();
  };

  const addToLists = (item:any) => {
    musicStore.lists.push(item);

    // 若尚未有歌曲 → 播第一首
    if (musicStore.index === -1) {
      setSourceByIndex(0);
      playMusic();
    };
  };

  const addMusic = (song:any, chakra: any) => {
    const list = {
      id: song.id,
      name: song.name,
      src: song.url,
      index: musicStore.index,
      chakra: chakra 
        ? (chakra.num === 99 ? chakra : chakra.num)
        : (chakra.num || 0)
    };

    // 添加到播放列表
    addToLists(list);

    // 如果是第一首歌，立即加载
    if (musicStore.title === "Please Select Music") {
      setSource({
        title: list.name,
        src: list.src
      });
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
      amount: musicStore.lists.length - 1,
      intro: "",
      content: [],
      chakra: []
    };

    musicStore.lists.forEach((e) => {
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
  };

  return {
    playMusic,
    pauseMusic,
    togglePlay,
    addToLists,
    addMusic,
    addChakra,
    loadSongSets,
    saveSet,
    removeSet
  }
}
