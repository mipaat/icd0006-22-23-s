<script setup lang="ts">
import { useIdentityStore } from '@/stores/identityStore';

const identityStore = useIdentityStore();
</script>

<template>
    JWT expires: {{ identityStore.jwt?.expiresAt }}
    <br />
    Refresh token expires: {{ identityStore.refreshToken?.expiresAt }}
    <br />
    User: {{ identityStore.jwt?.name }}
    Author: {{ identityStore.selectedAuthor?.displayName ?? identityStore.selectedAuthor?.userName }}
</template>