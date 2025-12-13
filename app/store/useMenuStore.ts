import type { MenuStoreState } from "~/types/data.types";

export const useMenuStore = defineStore('menu',() => {

  const state = reactive<MenuStoreState>({
    openMenu: "off",
    openSubNav: false,

    isJuniorMode: true,
    step: 0
  })
  
  const toggleMenu = (item:string) => {
    switch (item) {
      case "navMenu":
        state.openMenu === "off"
          ? (state.openMenu = "navMenu")
          : (state.openMenu = "off");
        break;
      case "listMode":
        state.openMenu = "off";
        state.isJuniorMode = !state.isJuniorMode;
        break;
      case "back":
        backToMenu();
        break;
      default:
        state.openMenu === item
          ? (state.openMenu = "off")
          : (state.openMenu = item);
        break;
    };
  };
  const backToMenu = () => {
    switch (state.openMenu) {
      case "Set.numbers":
      case "Set.five_elements":
      case "Set.custom":
        state.openMenu = "set";
        break;
      case "Music.fast":
      case "Music.medium":
      case "Music.slow":
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
        state.openMenu = "off";
        break;
    }
  };

  return {
    ...toRefs(state),
    toggleMenu,
    backToMenu
  }
},
{
  persist: true
})