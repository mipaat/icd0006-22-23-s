import { type InternalAxiosRequestConfig, isAxiosError } from 'axios';
import { DecodedJWT } from '../dto/identity/DecodedJWT';
import { isIJwtResponse } from '../dto/identity/IJWTResponse';
import { RefreshToken } from '../dto/identity/IRefreshToken';
import { isBoolean } from '../utils/Utils';
import { BaseService } from './BaseService';
import { IdentityService } from './IdentityService';
import {
    IAuthenticationContext,
    isJwtExpired,
    isRefreshTokenExpired
} from '../contexts/IAuthenticationContext';
import { NavigateFunction } from 'react-router-dom';

export class BaseAuthenticatedService extends BaseService {
    constructor(
        baseUrl: string,
        authContext: IAuthenticationContext,
        navigate: NavigateFunction,
        getLocation: () => Location,
    ) {
        super(baseUrl, navigate);

        function navigateToLogin() {
            const location = getLocation();
            return navigate(
                `/login?returnUrl=${encodeURIComponent(location.pathname + location.search)}`
            );
        }

        const identityService = new IdentityService(navigate);

        const refreshToken = async (): Promise<string | null> => {
            if (authContext.ongoingRefreshPromise !== null) {
                return await authContext.ongoingRefreshPromise;
            }
            const refreshPromise = _refreshToken();
            authContext.setOngoingRefreshPromise!(refreshPromise);
            const completedRefreshPromise = await refreshPromise;
            authContext.setOngoingRefreshPromise!(null);
            return completedRefreshPromise;
        };

        const _refreshToken = async (): Promise<string | null> => {
            if (
                authContext.jwt &&
                authContext.refreshToken &&
                !isRefreshTokenExpired(authContext)
            ) {
                const jwtResponse = await identityService!.refreshToken({
                    jwt: authContext.jwt.token,
                    refreshToken: authContext.refreshToken.token
                });

                if (isIJwtResponse(jwtResponse)) {
                    authContext.setJwt!(new DecodedJWT(jwtResponse.jwt));
                    authContext.setRefreshToken!(new RefreshToken(jwtResponse));
                    return jwtResponse.jwt;
                }
            }

            return null;
        };

        this.axios.interceptors.request.use((requestConfig) => {
            if (!isAxiosRetryConfig(requestConfig)) {
                const retryRequestConfig = requestConfig as IAxiosRetryConfig;
                retryRequestConfig.refreshAttempted = false;
                retryRequestConfig.allowUnauthenticated = false;
                return retryRequestConfig;
            }
            return requestConfig;
        });

        this.axios.interceptors.request.use(async (request) => {
            const currentTime = new Date();
            currentTime.setSeconds(currentTime.getSeconds() + 5);

            let allowUnauthenticated = false;
            if (isAxiosRetryConfig(request)) {
                allowUnauthenticated = request.allowUnauthenticated;
                if (request.refreshAttempted === true) {
                    return request;
                }
            }

            if (!authContext.jwt) {
                if (allowUnauthenticated) {
                    return request;
                }
                navigateToLogin();
                return Promise.reject('No JWT');
            }

            if (isJwtExpired(authContext)) {
                if (isRefreshTokenExpired(authContext)) {
                    navigateToLogin();
                    return Promise.reject('Invalid refresh token');
                }

                if (isAxiosRetryConfig(request)) {
                    request.refreshAttempted = true;
                }

                let jwt: string | null;
                try {
                    jwt = await refreshToken();
                } catch (e) {
                    console.log('Failed to get JWT', e);
                    if (isAxiosError(e) && e.response?.status === 401) {
                        navigateToLogin();
                    } else {
                        throw e;
                    }
                    return Promise.reject('Failed to get JWT');
                }
                if (jwt) {
                    setAuthorizationHeader(request, jwt);
                    return request;
                }
                navigateToLogin();
                return Promise.reject('Failed to get JWT');
            }

            setAuthorizationHeader(request, authContext.jwt.token);

            return request;
        });

        this.axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (isAxiosError(error)) {
                    if (error.response?.status === 401) {
                        const config = error.config;
                        if (
                            isAxiosRetryConfig(config) &&
                            config.refreshAttempted === false &&
                            authContext.jwt &&
                            authContext.refreshToken &&
                            !isRefreshTokenExpired(authContext)
                        ) {
                            config.refreshAttempted = true;
                            const jwt = await refreshToken();
                            if (!jwt) {
                                navigateToLogin();
                                return Promise.reject(error);
                            }
                            setAuthorizationHeader(config, jwt);
                            return await this.axios.request(config);
                        }

                        navigateToLogin();
                        return Promise.reject(error);
                    }
                }

                return Promise.reject(error);
            }
        );
    }
}

function setAuthorizationHeader(request: InternalAxiosRequestConfig, jwt: string) {
    request.headers.Authorization = 'Bearer ' + jwt;
}

export interface IAxiosRetryConfig extends InternalAxiosRequestConfig {
    refreshAttempted: boolean;
    allowUnauthenticated: boolean;
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
