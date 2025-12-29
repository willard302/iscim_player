export const useAuth = () => {
  
  const client = useSupabaseClient();
  const mainStore = useMainStore();
  const musicStore = useMusicStore();
  const playerStore = usePlayerStore();
  const { destroyAudio } = useAudioManager();
  const { pauseMusic } = usePlayer();

  const saveUserState = (userId: string) => {
    if (!userId) return;

    const userState = {
      music: musicStore.$state,
      player: playerStore.$state
    };

    localStorage.setItem(`user_prefs_${userId}`, JSON.stringify(userState));
  };

  const restoreUserState = (userId: string) => {
    if (!userId) return;

    const savedStateStr = localStorage.getItem(`user_prefs_${userId}`);
    if (savedStateStr) {
      try {
        const savedState = JSON.parse(savedStateStr);

        if (savedState.music) {
          musicStore.$patch(savedState.music);
        }

        if (savedState.player) {
          playerStore.$patch({
            ...savedState.player,
            isPlaying: false
          })
        }
      } catch (error) {
        console.error(`Failed to restore user state ${error}`);
      }
    }
  };

  const login = async(email: string, password: string) => {
    
    await logout(false);

    const {data, error} = await client.auth.signInWithPassword({
      email, password
    });

    if (error) throw new Error (error.message || 'Login failed');

    if (data.user?.id) {
      restoreUserState(data.user.id)
    };

    return data;
  };

  const loginWithGoogle = async() => {
    const {data, error} = await client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + '/auth/confirm',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    });

    if (error) throw new Error(error.message);
    return data;
  };

  const logout = async(redirect = true) => {
    try {
      const {data: {session}} = await client.auth.getSession();
      const currentUserId = session?.user.id || mainStore.userInfo.id;

      if (currentUserId) {
        saveUserState(currentUserId)
      };

      const {error} = await client.auth.signOut();
      if (error) throw error;
      
      pauseMusic();
      mainStore.initAuth();
      musicStore.resetMusic();
      playerStore.resetPlayer();
      destroyAudio();

      if (redirect) {
        await navigateTo('/auth', { replace: true });
      };      
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      closeToast();
    };
  };

  const register = async(username: string, password: string) => {
    const {data, error} = await client.auth.signUp({
      email: username,
      password: password
    });
    if (error) throw new Error(error.message)
      
    return data;
  };

  return { login, logout, register, loginWithGoogle }
}
