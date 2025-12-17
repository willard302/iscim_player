export const useAuthStore = defineStore("auth", () => {
  const state = reactive({
    showForgetPassword: false
  });

  const handleShowForgetPassword = () => {
    state.showForgetPassword = !state.showForgetPassword;
  };
  
  return {
    ...toRefs(state),
    handleShowForgetPassword
  }
},
{
  persist: true
})