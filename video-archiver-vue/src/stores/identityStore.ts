import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';

import { LocalStorageService } from '@/localStorage/LocalStorageService';
import { JWT_KEY, REFRESH_TOKEN_KEY, SELECTED_AUTHOR_KEY } from '@/localStorage/LocalStorageKeys';
import type { IRefreshToken } from '@/dto/IRefreshToken';
import { DecodedJWT } from '@/dto/DecodedJWT';
import type { IUserSubAuthor } from '@/dto/IUserSubAuthor';

const localStorageService = new LocalStorageService();
const storedJwt = localStorageService.getItem(JWT_KEY);
const storedRefreshToken = localStorageService.getItem(REFRESH_TOKEN_KEY);
const storedSelectedAuthor = localStorageService.getItem(SELECTED_AUTHOR_KEY);

let readRefreshToken: IRefreshToken | null = null;
if (storedRefreshToken) {
    const parsedStoredRefreshToken = JSON.parse(storedRefreshToken);
    readRefreshToken = {
        token: parsedStoredRefreshToken['token'],
        expiresAt: new Date(parsedStoredRefreshToken['expiresAt'])
    };
}

const readJwt = storedJwt ? new DecodedJWT(storedJwt) : null;

let readSelectedAuthor: IUserSubAuthor | null = null;
if (storedSelectedAuthor) {
    const parsedStoredSelectedAuthor = JSON.parse(storedSelectedAuthor);
    readSelectedAuthor = {
        id: parsedStoredSelectedAuthor['id'],
        userName: parsedStoredSelectedAuthor['userName'],
        displayName: parsedStoredSelectedAuthor['displayName'],
    };
}

export const useIdentityStore = defineStore('identityStore', () => {
    const jwt = ref(readJwt);
    const refreshToken = ref(readRefreshToken);
    const selectedAuthor = ref(readSelectedAuthor);

    const isLoggedIn = computed(() => {
        return jwt.value && refreshToken.value;
    });

    const isRefreshTokenExpired = computed(() => {
        if (!refreshToken.value) return false;
        return refreshToken.value.expiresAt < new Date();
    });

    const loginRequired = computed(() => {
        return !isLoggedIn.value || isRefreshTokenExpired.value;
    });

    watch(jwt, (newJwt) => {
        if (newJwt) {
            localStorageService.setItem(JWT_KEY, newJwt.token);
        } else {
            localStorageService.removeItem(JWT_KEY);
        }
    });

    watch(refreshToken, (newRefreshToken) => {
        if (newRefreshToken) {
            localStorageService.setItem(REFRESH_TOKEN_KEY, JSON.stringify(newRefreshToken));
        } else {
            localStorageService.removeItem(REFRESH_TOKEN_KEY);
        }
    });

    watch(selectedAuthor, (newSelectedAuthor) => {
        if (newSelectedAuthor) {
            localStorageService.setItem(SELECTED_AUTHOR_KEY, JSON.stringify(newSelectedAuthor));
        } else {
            localStorageService.removeItem(REFRESH_TOKEN_KEY);
        }
    });

    return { jwt, refreshToken, selectedAuthor, isLoggedIn, isRefreshTokenExpired, loginRequired };
});
