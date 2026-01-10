import type { MusicStoreState } from "~/types/data.types";
import { usePlayerStore } from "./usePlayerStore";
import type { MusicRow, SetInsert } from "~/types/supabase";


export const useMusicStore = defineStore("music", () => {

  const { getMusics, getSets } = useDataBase();
  
  const playerStore = usePlayerStore();

  const state = reactive<MusicStoreState>({
    isPro: true,
    name: "Hints.select_music",
    queue: [],
    item: null,
    subMusic: [],
    subMusicUpdated: [],
    subSet: [],
    chakra: {
      name: "enhance",
      num: 0,
      idx: 0,
      lists: []
    },
    newSet: {
      name: "",
      intro: "",
      category: "custom",
      is_pro: true,
      chakras: [],
      content: ""
    } as SetInsert,
    slidePercent: 0,
    diskRotation: 0,
    isDragging: false,
    isDataLoaded: false
  });

  const setLoop = () => {
    const modeList = ["normal", "repeatOne", "repeatAll"] as const;
    let modeIdx = modeList.indexOf(playerStore.loop);
    let nextMode = modeList[(modeIdx + 1) % modeList.length];
    if (!nextMode) return; 
    playerStore.loop = nextMode;
  };

  const composeMusic = (musicList: MusicRow[], musicClass: string) => {
    return musicList.map(music => ({
      ...music,
      name: `${musicClass} ${music.name}`
    }));
  };

  const resetMusic = () => {
    state.name = "Hints.select_music";
    state.queue = [];
    state.slidePercent = 0;
  };

  const initNewSet = () => {
    Object.assign(state.newSet, {
      name: "",
      intro: "",
      category: "custom",
      is_pro: true,
      chakras: [],
      content: []
    })
  };

  const handleToggleType = () => {
    state.isPro = !state.isPro
  };

  const initMusicData = async() => {

    if (state.isDataLoaded) return;

    try {
      const p_music_default = getMusics('default');
      const p_set_numbers = getSets({category: 'numbers', is_pro: state.isPro});
      const p_set_five_elements = getSets({category: 'five_elements', is_pro: state.isPro});

      let p_music_custom, p_set_custom;
      if (state.isPro) {
        p_music_custom = getMusics('custom');
        p_set_custom = getSets({category: 'custom', is_pro: true});
      }

      const [music_default, set_numbers, set_five_elements] = await Promise.all([
        p_music_default, p_set_numbers, p_set_five_elements
      ]);

      const defaultList = music_default;
      state.subMusic = [
        {name: "Music.fast", id: "fast", menu: composeMusic(defaultList, 'Fast')},
        {name: "Music.medium", id: "medium", menu: composeMusic(defaultList, 'Medium')},
        {name: "Music.slow", id: "slow", menu: composeMusic(defaultList, 'Slow')}
      ];

      state.subSet = [
        {name: "Set.numbers", id: "numbers", menu: set_numbers},
        {name: "Set.five_elements", id: "five_elements", menu: set_five_elements}
      ];
      
      if (state.isPro) {
        const [music_custom, set_custom] = await Promise.all([
          p_music_custom, p_set_custom
        ]);

        const customList = Array.isArray(music_custom) ? music_custom : [];
        const customSetList = Array.isArray(set_custom) ? set_custom : [];

        state.subSet.push({name: "Set.custom", id: "custom", menu: customSetList});

        state.subMusicUpdated = [
          {
            name: "Menu.numbers_music",
            id: "numbers_music",
            menu: composeMusic(customList, 'Numbers')
          },
          {
            name: "Menu.five_elements_music",
            id: "five_elements_music",
            menu: composeMusic(customList, "Five_Elements")
          }
        ];
      };

      state.isDataLoaded = true;
    } catch (error) {
      console.error(`Error fetching APIs: ${error}`);
    }
  };

  return {
    ...toRefs(state),
    setLoop,
    composeMusic,
    resetMusic,
    initNewSet,
    handleToggleType,
    initMusicData
  };
},
{
  persist: true
})