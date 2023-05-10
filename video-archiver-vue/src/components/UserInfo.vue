<script setup lang="ts">
import { useIdentityStore } from '@/stores/identityStore';

const identityStore = useIdentityStore();
</script>

<template>
    JWT expires: {{ identityStore.jwt?.expiresAt }}
    <br />
    Refresh token expires: {{ identityStore.refreshToken?.expiresAt }}
</template>