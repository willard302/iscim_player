import type { MainStoreState } from "~/types/data.types";

export const useMainStore = defineStore('main', {
  state: (): MainStoreState => ({
    isAuthenticated: true,
    tabBarActive: 'home',
    locale: "tw",
    showTabbar: true,
    user: {
      id: "1234567",
      name: "nico",
      avatar: "/avatar.png",
      musicTherapy: true
    }
  }),
  persist: true
})