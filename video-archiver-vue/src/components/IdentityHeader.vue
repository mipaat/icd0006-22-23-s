<script setup lang="ts">
import { useIdentityStore } from '@/stores/identityStore';
import UserInfo from './UserInfo.vue';
const store = useIdentityStore();
</script>

<template>
    <template v-if="store.jwt && store.refreshToken">
        <li className="nav-item">
            <Link to="info" className="nav-link text-dark">
            <UserInfo />
            </Link>
        </li>
        <li className="nav-item">
            <!-- <a onClick={(e)=> {
                e.preventDefault();
                logout();
                }} className="nav-link text-dark" href="#">Logout</a> -->
        </li>
    </template>
    <template v-else>
        <li className="nav-item">
                <RouterLink to="register" className="nav-link text-dark">Register</RouterLink>
            </li>
            <li className="nav-item">
                <RouterLink to="login" className="nav-link text-dark">Login</RouterLink>
            </li>
    </template>
</template>