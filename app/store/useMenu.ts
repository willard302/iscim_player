export const useMenuStore = defineStore('menu', {
  state:() => ({
    openMenu: "off",
    isJuniorMode: false
  }),
  actions: {
    toggleMenu(item:string){
      console.log("toggle",item)
      switch (item) {
        case "navMenu":
          this.openMenu == "off"
            ? (this.openMenu = "navMenu")
            : (this.openMenu = "off");
          break;
        case "listMode":
          this.openMenu = "off";
          this.isJuniorMode = !this.isJuniorMode;
          break;
        case "back":
          this.backToMenu();
          break;
        default:
          this.openMenu == item
            ? (this.openMenu = "off")
            : (this.openMenu = item);
          break;
      };
    },
    backToMenu() {
      switch (this.openMenu) {
        case "numbers_set":
        case "Set.five_elements":
        case "Set.custom":
          this.openMenu = "set";
          break;
        case "Fast":
        case "Med":
        case "Slow":
          this.openMenu = "music";
          break;
        case "mymusic":
        case "music":
        case "set":
        case "chakra":
          this.openMenu = "navMenu";
          break;
        default:
          this.openMenu = "off";
          break;
      }
    }
  }
})