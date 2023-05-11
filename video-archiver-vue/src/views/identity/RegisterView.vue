<script setup lang="ts">
import { DecodedJWT } from '@/dto/DecodedJWT';
import { isIJwtResponse, type IJWTResponse } from '@/dto/IJWTResponse';
import { RefreshToken } from '@/dto/IRefreshToken';
import { isIRestApiErrorResponse, type IRestApiErrorResponse } from '@/dto/IRestApiErrorResponse';
import { isPendingApprovalError } from '@/dto/PendingApprovalError';
import router from '@/router';
import { IdentityService } from '@/services/IdentityService';
import { useIdentityStore } from '@/stores/identityStore';
import { ref } from 'vue';

let validationErrors = ref(new Array<string>());
let username = "";
let password = "";
let confirmPassword = "";

const identityService = new IdentityService();

const register = async (event: MouseEvent) => {
    event.preventDefault();

    if (username.length === 0 || password.length === 0) {
        validationErrors.value.push("Bad input values!");
        return;
    }

    if (password !== confirmPassword) {
        validationErrors.value.push("Passwords must match!");
        return;
    }

    validationErrors.value = [];

    let jwtResponse: IJWTResponse | IRestApiErrorResponse | undefined;
    try {
        jwtResponse = await identityService.register(username, password);
    } catch (e) {
        if (isPendingApprovalError(e)) {
            await router.push("/pendingApproval");
            return;
        }
        validationErrors.value.push("Unknown error occurred");
        return;
    }

    if (isIRestApiErrorResponse(jwtResponse)) {
        validationErrors.value.push(jwtResponse.error);
        return;
    }

    if (!isIJwtResponse(jwtResponse)) {
        validationErrors.value.push("Unknown error occurred");
        return;
    }

    const identityStore = useIdentityStore();
    identityStore.jwt = new DecodedJWT(jwtResponse.jwt);
    identityStore.refreshToken = new RefreshToken(jwtResponse);
    await router.push("/");
}
</script>

<template>
    <form>
        <h2>Create a new account.</h2>
        <hr />

        <ul :class="{ 'd-none': validationErrors.length === 0 }">
            <li v-for="(item) in validationErrors" :key="item">
                {{ item }}
            </li>
        </ul>

        <div class="form-floating mb-3">
            <input v-model="username" class="form-control" id="Input_Username" />
            <label for="Input_Username">Username</label>
        </div>

        <div class="form-floating mb-3">
            <input v-model="password" class="form-control" id="Input_Password" type="password" />
            <label for="Input_Password">Password</label>
        </div>

        <div class="form-floating mb-3">
            <input v-model="confirmPassword" class="form-control" id="Input_ConfirmPassword" type="password" />
            <label for="Input_ConfirmPassword">Confirm password</label>
        </div>

        <button @click="register" class="w-100 btn btn-lg btn-primary">Register</button>
    </form>
</template>