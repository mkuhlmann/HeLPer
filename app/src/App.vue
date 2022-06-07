<template>
  <Suspense>
    <router-view />
    <template #fallback>
      <q-spinner color="primary" size="3em" />
    </template>
  </Suspense>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import 'virtual:windi.css';


export default defineComponent({
  name: 'App'
});
</script>
