<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useIdentityStore } from './stores/identityStore';
import HeaderComponent from './components/HeaderComponent.vue';
const store = useIdentityStore();

</script>

<template>
  <HeaderComponent />
  <RouterView />
</template>
