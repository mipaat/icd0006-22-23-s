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
import { LoginRequiredError } from '../errors/LoginRequiredError';

export class BaseAuthenticatedService extends BaseService {
    constructor(baseUrl: string, authContext: IAuthenticationContext) {
        super(baseUrl);

        const identityService = new IdentityService();

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
                throw new LoginRequiredError();
            }

            if (isJwtExpired(authContext)) {
                if (isRefreshTokenExpired(authContext)) {
                    throw new LoginRequiredError();
                }

                if (isAxiosRetryConfig(request)) {
                    request.refreshAttempted = true;
                }

                let jwt: string | null;
                try {
                    jwt = await refreshToken();
                } catch (e) {
                    console.log('Failed to get JWT', e);
                    throw new LoginRequiredError();
                }
                if (jwt) {
                    setAuthorizationHeader(request, jwt);
                    return request;
                }
                throw new LoginRequiredError();
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
                                throw new LoginRequiredError();
                            }
                            setAuthorizationHeader(config, jwt);
                            return await this.axios.request(config);
                        }

                        throw new LoginRequiredError();
                    }
                }

                throw error;
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
