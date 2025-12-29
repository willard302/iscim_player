export default defineNuxtRouteMiddleware(async(to, from) => {
  const mainStore = useMainStore();

  const publicRoutes = ['/auth', '/policy', '/en/policy'];
  const isPublicRoute = publicRoutes.some(r => to.path.startsWith(r));

  if (isPublicRoute) return;

  if (!mainStore.isAuthenticated || !mainStore.userInfo) {

    if (process.client) {
      const { logout } = useAuth();
      if (typeof logout === 'function') await logout(false);
    }
    return navigateTo('/auth', {replace: true});
  };

  if (to.path === '/') {
    return navigateTo('/home');
  };
})
