import type { MainStoreState } from "~/types/data.types";
import type { UserRow, UserUpdate } from "~/types/supabase"

export const useMainStore = defineStore('main', () => {

  const state = reactive<MainStoreState>({
    isAuthenticated: false,
    tabBarActive: "home",
    locale: "tw",
    userInfo: {}
  });

  const initAuth = () => {
    state.isAuthenticated = false;
    state.userInfo = {}
  };

  const setAuthenticiated = (value: boolean) => {
    state.isAuthenticated = value;
  };

  const setUser = (value: Partial<UserRow> | Partial<UserUpdate>) => {
    state.userInfo = {...value}
  };

  const setTabBarActive = (active: string) => {
    state.tabBarActive = active;
  };

  return {
    ...toRefs(state),
    initAuth,
    setAuthenticiated,
    setUser,
    setTabBarActive
  }
},
{
  persist: true
})