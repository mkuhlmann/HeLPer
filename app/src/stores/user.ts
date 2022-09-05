import { useStorage } from '@vueuse/core';
import { $fetch } from 'ohmyfetch';
import { defineStore } from 'pinia';


export enum UserRole {
  admin = 'admin',
  physician = 'arzt',
  nurse = 'pflege'
};

export const useUserStore = defineStore('user', () => {
  const user = useStorage<string>('user', null);
  const jwt = useStorage<string>('jwt', null);

  const login = async (username: string, password?: string) => {
    try {
      const response = await $fetch('/api/auth', {
        method: 'POST',
        body: {
          username,
          password
        }
      });

      user.value = username;
      jwt.value = response.jwt;
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }

  }

  const logout = async () => {
    user.value = null;
    jwt.value = null;
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
    user,
    jwt
  }
});
