<script setup lang="ts">
import type { IUserSubAuthor } from '@/dto/identity/IUserSubAuthor';
import router from '@/router';
import { redirectToLogin } from '@/router/identityRedirects';
import { UserService } from '@/services/UserService';
import { useIdentityStore } from '@/stores/identityStore';
import { decodeURIComponentNullable } from '@/utils/Utils';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const returnUrl = decodeURIComponentNullable(route.query.returnUrl?.toString()) ?? "/";

const identityStore = useIdentityStore();
identityStore.selectedAuthor = null;

let authors = ref(null as IUserSubAuthor[] | null);

onMounted(async () => {
    if (identityStore.loginRequired) {
        await redirectToLogin(returnUrl);
        return;
    }
    const userService = new UserService();
    const fetchedAuthors = await userService.listUserSubAuthors();
    authors.value = fetchedAuthors;
    if (fetchedAuthors.length == 1) {
        await selectAuthor(fetchedAuthors[0]);
    }
});

const selectAuthor = async (author: IUserSubAuthor) => {
    identityStore.selectedAuthor = author;
    await router.push(returnUrl);
}

const onSelectAuthor = async (event: MouseEvent, author: IUserSubAuthor) => {
    event.preventDefault();
    await selectAuthor(author);
}

</script>

<template>
    <div v-if="authors">
        <h2>Choose an author to act as</h2>
        <div v-for="author in authors" :key="author.id" @click="event => onSelectAuthor(event, author)">
            {{ author.displayName ?? author.userName }}
        </div>
    </div>
    <div v-else>LOADING AUTHORS</div>
</template>