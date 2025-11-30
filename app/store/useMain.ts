import type { MainStoreState } from "~/types/data.types";

export const useMainStore = defineStore('main', {
  state: (): MainStoreState => ({
    isAuthenticated: true,
    tabBarActive: 'home',
    defaultAvatar: "",
    locale: "tw",
    showTabbar: true,
    user: {
      id: "1234567",
      name: "nico",
      musicTherapy: true
    }
  }),
  persist: true
})