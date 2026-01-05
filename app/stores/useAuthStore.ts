export const useAuthStore = defineStore("auth", () => {
  const state = reactive({
    showForgetPassword: false,
    active: "log_in",
    showLogin: true,
    email: ""
  });

  const handleShowForgetPassword = () => {
    state.showForgetPassword = !state.showForgetPassword;
  };

  const handleSwitchTab = (tab: string) => {
    state.active = tab;
  };
  
  return {
    ...toRefs(state),
    handleShowForgetPassword,
    handleSwitchTab
  }
},
{
  persist: true
})