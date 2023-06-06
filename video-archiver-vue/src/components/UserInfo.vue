<script setup lang="ts">
import { useIdentityStore } from '@/stores/identityStore';

const identityStore = useIdentityStore();
</script>

<template>
    {{ identityStore.jwt?.name }}
</template>