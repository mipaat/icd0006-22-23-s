import { type InternalAxiosRequestConfig, isAxiosError } from "axios";
import { DecodedJWT } from "../dto/identity/DecodedJWT";
import { isIJwtResponse } from "../dto/identity/IJWTResponse";
import { RefreshToken } from "../dto/identity/IRefreshToken";
import { isBoolean } from "../utils/Utils";
import { BaseService } from "./BaseService";
import { IdentityService } from "./IdentityService";
import { useIdentityStore } from "@/stores/identityStore";
import { redirectToLogin } from "@/router/identityRedirects";

export class BaseAuthenticatedService extends BaseService {
    constructor(baseUrl: string, identityService: IdentityService | null = null) {
        super(baseUrl);
        const store = useIdentityStore();

        identityService ??= new IdentityService();

        const refreshToken = async (): Promise<string | null> => {
            if (store.ongoingRefreshPromise !== null) {
                return await store.ongoingRefreshPromise;
            }
            store.ongoingRefreshPromise = _refreshToken();
            return await store.ongoingRefreshPromise;
        }

        const _refreshToken = async (): Promise<string | null> => {
            if (store.jwt && store.refreshToken && !store.isRefreshTokenExpired()) {
                const jwtResponse = await identityService!.refreshToken({
                    jwt: store.jwt.token,
                    refreshToken: store.refreshToken.token,
                });

                if (isIJwtResponse(jwtResponse)) {
                    store.jwt = new DecodedJWT(jwtResponse.jwt);
                    store.refreshToken = new RefreshToken(jwtResponse);
                    return jwtResponse.jwt;
                }
            }

            return null;
        }

        this.axios.interceptors.request.use(requestConfig => {
            if (!isAxiosRetryConfig(requestConfig)) {
                const retryRequestConfig = requestConfig as IAxiosRetryConfig;
                retryRequestConfig.refreshAttempted = false;
                retryRequestConfig.allowUnauthenticated = false;
                return retryRequestConfig;
            }
            return requestConfig;
        });

        this.axios.interceptors.request.use(async request => {
            const currentTime = new Date();
            currentTime.setSeconds(currentTime.getSeconds() + 5);

            let allowUnauthenticated = false;
            if (isAxiosRetryConfig(request)) {
                allowUnauthenticated = request.allowUnauthenticated;
                if (request.refreshAttempted === true) {
                    return request;
                }
            }

            if (!store.jwt) {
                if (allowUnauthenticated) {
                    return request;
                }
                await redirectToLogin();
                return Promise.reject("No JWT");
            }

            if (store.isJwtExpired()) {
                if (store.isRefreshTokenExpired()) {
                    await redirectToLogin();
                    return Promise.reject("Invalid refresh token");
                }

                if (isAxiosRetryConfig(request)) {
                    request.refreshAttempted = true;
                }

                let jwt: string | null;
                try {
                    jwt = await refreshToken();
                } catch (e) {
                    console.log("Failed to get JWT", e);
                    await redirectToLogin();
                    return Promise.reject("Failed to get JWT");
                }
                if (jwt) {
                    setAuthorizationHeader(request, jwt);
                    return request;
                }
                await redirectToLogin();
                return Promise.reject("Failed to get JWT");
            }

            setAuthorizationHeader(request, store.jwt.token);

            return request;
        });

        this.axios.interceptors.response.use(response => response, async error => {
            if (isAxiosError(error)) {
                if (error.response?.status === 401) {
                    const config = error.config;
                    if (isAxiosRetryConfig(config) && config.refreshAttempted === false && store.isLoggedIn && !store.isRefreshTokenExpired()) {
                        config.refreshAttempted = true;
                        const jwt = await refreshToken();
                        if (!jwt) {
                            await redirectToLogin();
                            return Promise.reject(error);
                        }
                        setAuthorizationHeader(config, jwt);
                        return await this.axios.request(config);
                    }

                    await redirectToLogin();
                    return Promise.reject(error);
                }
            }

            return Promise.reject(error);
        });
    }
}

function setAuthorizationHeader(request: InternalAxiosRequestConfig, jwt: string) {
    request.headers.Authorization = "Bearer " + jwt;
}

export interface IAxiosRetryConfig extends InternalAxiosRequestConfig {
    refreshAttempted: boolean,
    allowUnauthenticated: boolean,
}

export function isAxiosRetryConfig(config: any): config is IAxiosRetryConfig {
    if (!config) {
        return false;
    }
    if (config.refreshAttempted !== undefined && config.allowUnauthenticated !== undefined) {
        return isBoolean(config.refreshAttempted) && isBoolean(config.allowUnauthenticated);
    }
    return false;
}