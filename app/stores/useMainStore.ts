import type { MainStoreState } from "~/types/data.types";
import type { UserRow, UserUpdate } from "~/types/supabase"

export const useMainStore = defineStore('main', () => {

  const state = reactive<MainStoreState>({
    isAuthenticated: false,
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

  const toogleLocale = () => {
    state.locale = state.locale === 'tw' ? 'en' : 'tw'
  };

  return {
    ...toRefs(state),
    initAuth,
    setAuthenticiated,
    setUser,
    toogleLocale
  }
},
{
  persist: true
})