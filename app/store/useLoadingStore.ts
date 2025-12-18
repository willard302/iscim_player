export const useLoadingStore = defineStore('loading', () => {
  const count = ref(0);
  const isLoading = computed(() => count.value > 0);
  const startLoading = () => {
    count.value++;
  }
  const finishLoading = () => {
    if (count.value > 0) count.value--;
  };
  const resetLoading = () => count.value = 0;
  
  return {
    count,
    isLoading,
    startLoading,
    finishLoading,
    resetLoading
  }
},
{persist: true})