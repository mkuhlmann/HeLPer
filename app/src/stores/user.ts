import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";


export const useUserStore = defineStore('user', () => {
  const user = useStorage<string>('user', null);

  const login = async (username: string, password?: string) => {
    user.value = username;
    return true;
  }

  const logout = async () => {
    user.value = null;
  }

  const isLoggedIn = () => {
    return user.value !== null;
  }

  return {
    login,
    logout,
    isLoggedIn,
    user
  }
});
