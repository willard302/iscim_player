import type { MainStoreState } from "~/types/data.types";
import type { UserRow, UserUpdate } from "~/types/supabase";

export const useMainStore = defineStore('main', () => {

  const state = reactive<MainStoreState>({
    isAuthenticated: false,
    locale: "tw",
    userInfo: {},
    currentTab: 0,
    openPreferences: false,
    openPolicyPrivacy: false,
    openPolicyService: false
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

  const setCurrentTab = (index: number) => {
    state.currentTab = index;
  };

  const setPreferences = (value: boolean) => {
    state.openPreferences = value;
  };

  const setPolicyPrivacy = (value: boolean) => {
    state.openPolicyPrivacy = value;
  };

  const setPolicyService = (value: boolean) => {
    state.openPolicyService = value;
  };

  const toogleLocale = () => {
    state.locale = state.locale === 'tw' ? 'en' : 'tw'
  };

  return {
    ...toRefs(state),
    initAuth,
    setAuthenticiated,
    setUser,
    setCurrentTab,
    setPreferences,
    setPolicyPrivacy,
    setPolicyService,
    toogleLocale
  }
},
{
  persist: true
})