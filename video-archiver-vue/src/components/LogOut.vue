<script setup lang="ts">
import router from '@/router';
import { IdentityService } from '@/services/IdentityService';
import { useIdentityStore } from '@/stores/identityStore';

const identityStore = useIdentityStore();
const identityService = new IdentityService();
const logOut = async (event: MouseEvent) => {
    event.preventDefault();

    const refreshToken = identityStore.refreshToken;
    const jwt = identityStore.jwt;

    identityStore.jwt = null;
    identityStore.refreshToken = null;

    if (refreshToken && jwt) {
        await identityService.logout(refreshToken, jwt.token);
    }

    await router.push("/");
}
</script>

<template>
    <a @click="logOut" class="nav-link text-dark" href="#">Logout</a>
</template>