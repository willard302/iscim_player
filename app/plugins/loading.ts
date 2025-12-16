import { useLoadingStore } from "~/store/useLoadingStore";

export default defineNuxtPlugin((nuxtApp) => {
  const loadingStore = useLoadingStore();

  nuxtApp.hook("page:finish", () => {
    setTimeout(() => {
      loadingStore.finishLoading();
    }, 200);
  });

  nuxtApp.hook("vue:error", () => {
    loadingStore.resetLoading();
  });
});
