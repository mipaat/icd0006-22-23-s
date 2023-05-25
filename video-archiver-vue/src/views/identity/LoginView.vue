<script setup lang="ts">
import { DecodedJWT } from '@/dto/DecodedJWT';
import { isIJwtResponse } from '@/dto/IJWTResponse';
import { RefreshToken } from '@/dto/IRefreshToken';
import { isIRestApiErrorResponse } from '@/dto/IRestApiErrorResponse';
import { IdentityService } from '@/services/IdentityService';
import { useIdentityStore } from '@/stores/identityStore';
import router from '@/router/index';
import { ref } from 'vue';
import PendingApproval from '@/components/PendingApproval.vue';
import ValidationErrors from '@/components/ValidationErrors.vue';

const props = defineProps({
    returnUrl: {
        type: String,
        default: "/",
    }
});

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

    const jwtResponse = await identityService.login(username, password);

    if (isIRestApiErrorResponse(jwtResponse)) {
        if (jwtResponse.status === 401) {
            pendingApproval.value = true;
        } else {
            validationErrors.value.push(jwtResponse.error);
        }
        return;
    }

    if (!isIJwtResponse(jwtResponse)) {
        validationErrors.value.push("Unknown error occurred");
        return;
    }

    const identityStore = useIdentityStore();
    identityStore.jwt = new DecodedJWT(jwtResponse.jwt);
    identityStore.refreshToken = new RefreshToken(jwtResponse);
    await router.push(`/selectAuthor?returnUrl=${props.returnUrl}`);
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