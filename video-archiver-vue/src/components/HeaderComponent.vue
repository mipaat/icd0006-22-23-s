<script setup lang="ts">
import { useIdentityStore } from '@/stores/identityStore';
import AdminDropdown from './AdminDropdown.vue';
import IdentityHeader from './IdentityHeader.vue';

const identityStore = useIdentityStore();

</script>

<template>
    <header>
        <nav class="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
            <div class="container-fluid">
                <RouterLink class="navbar-brand" to="/">WebApp</RouterLink>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target=".navbar-collapse"
                    aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="navbar-collapse collapse d-sm-inline-flex justify-content-between">
                    <ul class="navbar-nav flex-grow-1">
                        <li class="nav-item">
                            <RouterLink to="/" class="nav-link text-dark">Home</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink :to="{ name: 'videoSearch' }" class="nav-link text-dark">Videos</RouterLink>
                        </li>
                        <AdminDropdown v-if="identityStore.jwt?.isAdmin" />
                    </ul>

                    <ul class="navbar-nav">
                        <IdentityHeader />
                    </ul>
                </div>
            </div>
        </nav>
    </header>
</template>