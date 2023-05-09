<script setup lang="ts">
import { useIdentityStore } from '@/stores/identityStore';
const store = useIdentityStore();
</script>

<template>
    <div v-if="store.jwt?.isAdmin">
        <div className="btn-group">
            <button type="button" className="btn btn-danger dropdown-toggle" data-bs-toggle="dropdown"
                aria-expanded="false">
                CRUD
            </button>
            <ul className="dropdown-menu">
                <li className="nav-item">
                    <RouterLink className="dropdown-item nav-link text-dark" to="/Crud/Game">Game</RouterLink>
                </li>
            </ul>
        </div>
    </div>
</template>