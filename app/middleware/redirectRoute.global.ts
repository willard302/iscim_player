import { useMainStore } from "~/store/useMainStore";

export default defineNuxtRouteMiddleware(async(to, from) => {
  const mainStore = useMainStore();

  const publicRoutes = ['/auth', '/policy', '/en/policy'];
  const isPublicRoute = publicRoutes.some(r => to.path.startsWith(r));

  if (isPublicRoute) return;

  if (!mainStore.isAuthenticated || !mainStore.userInfo) {
    const { logout } = useAuth();

    if (typeof logout === 'function') await logout(false);

    return navigateTo('/auth', {replace: true});
  };

  if (to.path === '/') {
    return navigateTo('/home');
  };

  const parts = to.path.split('/').filter(Boolean);
  const currentTab = parts[0];

  if (currentTab && mainStore.tabBarActive !== currentTab) {
    mainStore.setTabBarActive(currentTab);
  };
})
