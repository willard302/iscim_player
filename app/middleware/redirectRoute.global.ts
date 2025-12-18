import { useMainStore } from "~/store/useMainStore";

export default defineNuxtRouteMiddleware((to, from) => {
  const { logout } = useAuth();
  const mainStore = useMainStore();

  if (to.path === '/auth') return;

  if (!mainStore.isAuthenticated || !mainStore.userInfo) {
    if (typeof logout === 'function') logout();
    return navigateTo('/auth');
  };

  if (to.path === '/') {
    return navigateTo('/home');
  };


  if (mainStore.tabBarActive) {
    const isTabBarCorrect = to.path.includes(mainStore.tabBarActive);
    if (!isTabBarCorrect) {
      const newTab = to.path.split('/').join('');
      if (!newTab) return;
      mainStore.setTabBarActive(newTab);
    }
  }
})
