import { $fetch } from 'ohmyfetch';
import { useUserStore } from 'src/stores/user';

const userStore = useUserStore();

export const apiFetch = $fetch.create({
  headers: {
    'Authorization': `Bearer ${userStore.jwt}`,
    'X-User': userStore.user,
  }
});
