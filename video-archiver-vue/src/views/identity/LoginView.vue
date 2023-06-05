<script setup lang="ts">
import { DecodedJWT } from '@/dto/identity/DecodedJWT';
import { type IJWTResponse } from '@/dto/identity/IJWTResponse';
import { RefreshToken } from '@/dto/identity/IRefreshToken';
import { isIRestApiErrorResponse } from '@/dto/IRestApiErrorResponse';
import { IdentityService } from '@/services/IdentityService';
import { useIdentityStore } from '@/stores/identityStore';
import { ref } from 'vue';
import PendingApproval from '@/components/PendingApproval.vue';
import ValidationErrors from '@/components/ValidationErrors.vue';
import { redirectToSelectAuthor } from '@/router/identityRedirects';
import { ERestApiErrorType } from '@/dto/enums/ERestApiErrorType.js';
import { useRoute } from 'vue-router';
import { decodeURIComponentNullable } from '@/utils/Utils';

const route = useRoute();
const returnUrl = decodeURIComponentNullable(route.query.returnUrl?.toString()) ?? "/";

const identityStore = useIdentityStore();
identityStore.clearAll();

let validationErrors = ref(new Array<string>());
let pendingApproval = ref(false);
let username = "";
let password = "";
const identityService = new IdentityService();
const login = async (event: MouseEvent) => {
    event.preventDefault();

    pendingApproval.value = false;
    validationErrors.value = [];

    if (username.length === 0 || password.length === 0) {
        validationErrors.value.push("Bad input values!");
        return;
    }

    let jwtResponse: IJWTResponse;
    try {
        jwtResponse = await identityService.login(username, password);
    } catch (e) {
        if (isIRestApiErrorResponse(e)) {
            if (e.error === ERestApiErrorType.UserNotApproved) {
                pendingApproval.value = true;
            } else {
                validationErrors.value.push(e.error);
            }
            return;
        }
        validationErrors.value.push("Unknown error occurred");
        return;
    }

    identityStore.jwt = new DecodedJWT(jwtResponse.jwt);
    identityStore.refreshToken = new RefreshToken(jwtResponse);
    await redirectToSelectAuthor(returnUrl);
}
</script>

<template>
    <form class="form-signin w-100 m-auto">
        <h2>Login</h2>
        <hr />

        <PendingApproval v-if="pendingApproval" />
        <ValidationErrors :errors="validationErrors" />

        <div class="form-floating mb-3">
            <input v-model="username" class="form-control" id="Input_Username" />
            <label for="Input_Username">Username</label>
        </div>

        <div class="form-floating mb-3">
            <input v-model="password" class="form-control" id="Input_Password" type="password" />
            <label for="Input_Password">Password</label>
        </div>

        <button @click="login" class="w-100 btn btn-lg btn-primary">
            Login
        </button>
    </form>
</template>

<style scoped>
.form-signin {
    max-width: 430px;
    padding: 15px;
}

.form-signin .form-floating:focus-within {
    z-index: 2;
}

.form-signin input[type="email"] {
    margin-bottom: -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
}

.form-signin input[type="password"] {
    margin-bottom: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
}
</style>