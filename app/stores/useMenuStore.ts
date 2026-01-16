import type { MenuStoreState } from "~/types/data.types";

export const useMenuStore = defineStore('menu',() => {

  const state = reactive<MenuStoreState>({
    step: 1
  });
  
  const resetStep = () => {
    state.step = 1;
  }

  return {
    ...toRefs(state),
    resetStep
  }
},
{
  persist: true
})