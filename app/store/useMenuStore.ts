import type { MenuStoreState } from "~/types/data.types";

export const useMenuStore = defineStore('menu',() => {

  const state = reactive<MenuStoreState>({
    openMenu: "",
    isMusicList: true,
    isAdvancedMenu: false,
    isJuniorMenu: false,
    isJuniorMode: true,
    step: 1
  });

  const toggleAdvanceMenu = () => {
    state.isAdvancedMenu = !state.isAdvancedMenu;
  };

  const toggleMusicList = () => {
    state.isMusicList = !state.isMusicList;
  };

  const toggleJuniorMenu = () => {
    state.isJuniorMenu = !state.isJuniorMenu;
  };

  const toggleJuniorMode = () => {
    state.isJuniorMode = !state.isJuniorMode;
  };
  
  const toggleMenu = (item:string) => {
    if (!item) return;
    state.openMenu = item
  };

  const backToMenu = () => {
    switch (state.openMenu) {
      case "numbers":
      case "five_elements":
      case "custom":
        state.openMenu = "set";
        break;
      case "fast":
      case "medium":
      case "slow":
        state.openMenu = "music";
        break;
      case "numbers_music":
      case "five_elements_music":
        state.openMenu = 'mymusic';
        break;
      case "mymusic":
      case "music":
      case "set":
      case "chakra":
        state.openMenu = "navMenu";
        break;
      default:
        state.openMenu = "";
        break;
    }
  };
  
  const resetStep = () => {
    state.step = 1;
  }

  return {
    ...toRefs(state),
    toggleMenu,
    backToMenu,
    resetStep,
    toggleMusicList,
    toggleJuniorMenu,
    toggleJuniorMode,
    toggleAdvanceMenu
  }
},
{
  persist: true
})