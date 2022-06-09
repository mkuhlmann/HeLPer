import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";


export const useUserStore = defineStore('user', () => {
  const user = useStorage<string>('user', null);

  const login = async (username: string, password?: string) => {
    if (username != 'arzt' && username != 'pflege') {
      return false;
    }
    user.value = username;
    return true;
  }

  const logout = async () => {
    user.value = null;
  }

  const isLoggedIn = () => {
    return user.value !== null;
  }

  const isPhysician = () => {
    return user.value === 'arzt';
  };

  const isNurse = () => {
    return user.value === 'pflege';
  };

  return {
    login,
    logout,
    isLoggedIn,
    user
  }
});
