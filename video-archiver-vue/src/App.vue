<script setup lang="ts">
import { RouterView } from 'vue-router'
import HeaderComponent from './components/HeaderComponent.vue';

</script>

<template>
  <HeaderComponent />
  <div class="container">
    <main role="main" class="pb-3">
      <RouterView />
    </main>
  </div>
</template>
