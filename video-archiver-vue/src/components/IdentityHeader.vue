<script setup lang="ts">
import { useIdentityStore } from '@/stores/identityStore';
import UserInfo from './UserInfo.vue';
import LogOut from './LogOut.vue';
const store = useIdentityStore();
</script>

<template>
    <template v-if="store.jwt && store.refreshToken">
        <li class="nav-item">
            <UserInfo />
        </li>
        <li class="nav-item">
            <LogOut />
        </li>
    </template>
    <template v-else>
        <li class="nav-item">
            <RouterLink :to="{ name: 'register' }" class="nav-link text-dark">Register</RouterLink>
        </li>
        <li class="nav-item">
            <RouterLink :to="{
                name: 'login', query: {
                    returnUrl: $router.currentRoute.value.name !== 'login'
                        ? $router.currentRoute.value.fullPath
                        : $router.currentRoute.value.query.returnUrl?.toString()
                }
            }" class="nav-link text-dark">Login</RouterLink>
        </li>
    </template>
</template>