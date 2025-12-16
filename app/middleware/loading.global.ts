import { useLoadingStore } from "~/store/useLoadingStore";

export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path === from.path) return;

  const loadingStore = useLoadingStore();

  loadingStore.startLoading();
})
