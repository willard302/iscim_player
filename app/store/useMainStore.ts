export const useMainStore = defineStore('main', () => {
  const isAuthenticated = ref(false);
  const tabBarActive = ref("home");
  const locale = ref("tw");
  const showTabbar = ref(true);
  const user = reactive({
    id: "1234567",
    name: "nico",
    avatar: "/avatar.png",
    musicTherapy: true 
  });

  return {
    isAuthenticated,
    tabBarActive, 
    locale,
    showTabbar,
    user
  }

},
{
  persist: true
})