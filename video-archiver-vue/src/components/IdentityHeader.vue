<script setup lang="ts">
import { useIdentityStore } from '@/stores/identityStore';
import UserInfo from './UserInfo.vue';
const store = useIdentityStore();
</script>

<template>
    <template v-if="store.jwt && store.refreshToken">
        <li class="nav-item">
            <Link to="info" class="nav-link text-dark">
            <UserInfo />
            </Link>
        </li>
        <li class="nav-item">
            <!-- <a onClick={(e)=> {
                e.preventDefault();
                logout();
                }} class="nav-link text-dark" href="#">Logout</a> -->
        </li>
    </template>
    <template v-else>
        <li class="nav-item">
                <RouterLink to="register" class="nav-link text-dark">Register</RouterLink>
            </li>
            <li class="nav-item">
                <RouterLink to="login" class="nav-link text-dark">Login</RouterLink>
            </li>
    </template>
</template>