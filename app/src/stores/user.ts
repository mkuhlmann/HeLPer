import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';


export enum UserRole {
  admin = 'admin',
  physician = 'arzt',
  nurse = 'pflege'
};

export const useUserStore = defineStore('user', () => {
  const user = useStorage<string>('user', null);

  const login = async (username: string, password?: string) => {
    if (username != 'arzt' && username != 'pflege' && username != 'admin') {
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

  const isRole = (role: UserRole) => {
    return user.value === role;
  }

  return {
    login,
    logout,
    isLoggedIn,
    isRole,
    user
  }
});
