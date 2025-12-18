import { useMainStore } from "~/store/useMainStore";
import type { FieldItem } from "~/types/data.types";

export const useAuth = () => {
  
  const client = useSupabaseClient();
  const mainStore = useMainStore();

  const login = async(email: string, password: string) => {
    
    await logout(false);

    const {data, error} = await client.auth.signInWithPassword({
      email, password
    });

    if (error) throw new Error (error.message || 'Login failed');

    return data;
  };

  const logout = async(redirect = true) => {
    showLoadingToast("Loading...");

    try {
      const {error} = await client.auth.signOut();
      if (error) throw error;
        
      mainStore.initAuth();

      if (redirect) {
        await navigateTo('/auth', { replace: true });
      };      
    } catch (error) {
      console.error("Logout failed:", error);
      showFailToast("Logout error")
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

  return { login, logout, register }
}
