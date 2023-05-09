import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

import * as configJson from '@/config.json';
import { type IConfig } from '@/config';
import { LocalStorageService } from '@/localStorage/LocalStorageService';
import { JWT_KEY, REFRESH_TOKEN_KEY } from '@/localStorage/LocalStorageKeys';
import type { IRefreshToken } from '@/dto/IRefreshToken';
import { DecodedJWT } from '@/dto/DecodedJWT';

const config = configJson as IConfig;

const localStorageService = new LocalStorageService(config.localStorageKey);
const storedJwt = localStorageService.getItem(JWT_KEY);
const storedRefreshToken = localStorageService.getItem(REFRESH_TOKEN_KEY);

let readRefreshToken: IRefreshToken | null = null;
if (storedRefreshToken) {
    const parsedStoredRefreshToken = JSON.parse(storedRefreshToken);
    readRefreshToken = {
        token: parsedStoredRefreshToken['token'],
        expiresAt: new Date(parsedStoredRefreshToken['expiresAt'])
    };
}

const readJwt = storedJwt ? new DecodedJWT(storedJwt) : null;

export const useIdentityStore = defineStore('identityStore', () => {
    const jwt = ref(readJwt);
    const refreshToken = ref(readRefreshToken);

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

    return { jwt, refreshToken };
});
