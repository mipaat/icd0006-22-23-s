<script setup lang="ts">
import { useIdentityStore } from '@/stores/identityStore';
const store = useIdentityStore();
</script>

<template>
    <div v-if="store.jwt?.isAdmin">
        <div class="btn-group">
            <button type="button" class="btn btn-danger dropdown-toggle" data-bs-toggle="dropdown"
                aria-expanded="false">
                CRUD
            </button>
            <ul class="dropdown-menu">
                <li class="nav-item">
                    <RouterLink class="dropdown-item nav-link text-dark" to="/Crud/Game">Game</RouterLink>
                </li>
            </ul>
        </div>
    </div>
</template>