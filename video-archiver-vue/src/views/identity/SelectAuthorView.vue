<script setup lang="ts">
import { isIRestApiErrorResponse } from '@/dto/IRestApiErrorResponse';
import type { IUserSubAuthor } from '@/dto/IUserSubAuthor';
import router from '@/router';
import { UserService } from '@/services/UserService';
import { useIdentityStore } from '@/stores/identityStore';
import { ref } from 'vue';

const props = defineProps({
    returnUrl: {
        type: String,
        default: "/",
    }
});

const identityStore = useIdentityStore();
identityStore.selectedAuthor = null;

if (identityStore.loginRequired) {
    router.push(`/login?returnUrl=${props.returnUrl}`);
}

let authors = ref(null as IUserSubAuthor[] | null);

const userService = new UserService();
userService.listUserSubAuthors().then(async (fetchedAuthors) => {
    if (!isIRestApiErrorResponse(fetchedAuthors) && fetchedAuthors !== undefined) {
        authors.value = fetchedAuthors;
        if (fetchedAuthors.length == 1) {
            await selectAuthor(fetchedAuthors[0]);
        }
    }
});

const selectAuthor = async (author: IUserSubAuthor) => {
    identityStore.selectedAuthor = author;
    await router.push(props.returnUrl);
}

const onSelectAuthor = async (event: MouseEvent, author: IUserSubAuthor) => {
    event.preventDefault();
    await selectAuthor(author);
}

</script>

<template>
    <div v-if="authors">
        <h2>Choose an author to act as</h2>
        <div v-for="author in authors" @click="event => onSelectAuthor(event, author)">
            {{ author.displayName ?? author.userName }}
        </div>
    </div>
    <div v-else>LOADING AUTHORS</div>
</template>