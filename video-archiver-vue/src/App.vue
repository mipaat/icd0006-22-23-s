<script setup lang="ts">
import { RouterView } from 'vue-router';
import HeaderComponent from './components/HeaderComponent.vue';
import { onErrorCaptured } from 'vue';
import { isIRestApiErrorResponse } from './dto/IRestApiErrorResponse';
import { isAxiosError } from 'axios';
import { redirectToError, redirectToForbid, redirectToNotFound } from './router/redirects';
import { LoginRequiredError } from './errors/LoginRequiredError';
import { redirectToLogin } from './router/identityRedirects';

onErrorCaptured(err => {
    console.log("Error captured:", err);
    if (err instanceof LoginRequiredError) {
        redirectToLogin();
        return;
    }
    if (isAxiosError(err)) {
        if (err.response?.status === 403) {
            redirectToForbid();
            return;
        } else if (err.response?.status !== 404) {
            redirectToNotFound();
            return;
        } else {
            redirectToError(err.message);
            return;
        }
    }
    if (isIRestApiErrorResponse(err)) {
        redirectToError(err.message);
        return;
    }
    redirectToError(err.message);
});
</script>

<template>
    <HeaderComponent />
    <div class="container">
        <main role="main" class="pb-3">
            <RouterView />
        </main>
    </div>
</template>
