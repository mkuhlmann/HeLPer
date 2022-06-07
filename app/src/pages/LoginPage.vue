<script lang="ts" setup>
import { ref } from 'vue';


const user = ref({
  email: 'demo',
  password: 'demo'
})
</script>

<template>
  <div class="flex items-center justify-center h-full w-full absolute">
    <q-card bordered class="p-5">
      <h1 class="text-lg mb-10 font-bold">HeLPer Login</h1>
      <q-form class="q-gutter-md">
        <q-input square filled clearable v-model="user.email" type="text" tabindex="1" label="Nutzername" />
        <q-input square filled clearable v-model="user.password" type="password" tabindex="2" label="Passwort" />
      </q-form>

    </q-card>
  </div>
</template>
