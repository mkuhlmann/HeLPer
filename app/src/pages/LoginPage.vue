<script lang="ts" setup>
import { useUserStore } from 'src/stores/user';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

if (userStore.isLoggedIn()) {
  router.push('/');
}

const user = ref({
  username: 'arzt',
  password: 'demo'
});
const error = ref(false);

const login = async () => {
  if (await userStore.login(user.value.username, user.value.password)) {
    router.push('/');
  } else {
    error.value = true;
  }
}
</script>

<template>
  <div class="flex items-center justify-center h-full w-full absolute">
    <q-card bordered class="max-w-screen-sm">
      <q-card-section>
        <h1 class="text-lg mb-5 font-bold">HeLPer Login</h1>
        <q-banner class="bg-primary text-white mb-10">
          Diese PoC-App behinhaltet keinen Authentifizierung-Mechanismus, dieses Formular dient der Demonstration.
          <br /><br />Login mit Nutzer arzt/pflege/admin und beliebigem Passwort.
        </q-banner>
        <q-form class="q-gutter-md">
          <q-input square filled clearable v-model="user.username" type="text" tabindex="1" label="Nutzername" />
          <q-input square filled clearable v-model="user.password" type="password" tabindex="2" label="Passwort" />
          <div>
            <q-btn v-on:click="login()" color="primary" class="full-width" tabindex="3">Login</q-btn>
          </div>
        </q-form>
        <q-banner v-if="error" class="bg-red text-white mt-5">
          Benutzername oder Passwort falsch.
        </q-banner>
      </q-card-section>
    </q-card>
  </div>
</template>
