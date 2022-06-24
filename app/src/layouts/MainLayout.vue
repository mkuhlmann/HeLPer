<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-btn flat dense round icon="home" aria-label="Home" to="/" />

        <q-toolbar-title>
          HeLPer
        </q-toolbar-title>

        <div class="mr-2">Willkommen, {{ userStore.user }}</div>

        <q-btn @click="logout()" flat dense round icon="logout" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered>
      <q-list class="h-full">
        <q-item-label header>
          HeLPer
        </q-item-label>

        <EssentialLink title="Startseite" icon="home" link="/" caption="Patientenübersicht" :internal="true" />

        <q-separator class="my-5" />

        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';
import { UserRole, useUserStore } from 'src/stores/user';
import { useRouter } from 'vue-router';

const linksList = [
  {
    title: 'Dokumentation',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev',
    internal: false
  }
];

const user = useUserStore();

if (user.isRole(UserRole.admin)) {
  linksList.push({
    title: 'Audit Trail',
    caption: 'Letzte Änderungen anzeigen',
    icon: 'code',
    link: '/audit',
    internal: true
  });
}

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup() {
    const leftDrawerOpen = ref(false);
    const userStore = useUserStore();
    const router = useRouter();

    if (!userStore.isLoggedIn()) {
      router.push('/login');
    }


    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      logout() {
        userStore.logout();
        router.push('/login');
      },
      userStore
    }
  }
});
</script>
