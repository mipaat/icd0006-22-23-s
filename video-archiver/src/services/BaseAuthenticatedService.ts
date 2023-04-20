import { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig, isAxiosError } from "axios";
import { DecodedJWT } from "../dto/DecodedJWT";
import { IAuthenticationContext } from "../dto/IAuthenticationContext";
import { isIJwtResponse } from "../dto/IJWTResponse";
import { RefreshToken } from "../dto/IRefreshToken";
import { BaseService } from "./BaseService";
import { IdentityService } from "./IdentityService";

export class BaseAuthenticatedService extends BaseService {
    constructor(baseUrl: string, authContext: IAuthenticationContext, identityService: IdentityService | null = null) {
        super(baseUrl);

        identityService ??= new IdentityService();

        const refreshToken = async () => {
            if (authContext.authState?.jwt && authContext.authState.refreshToken) {
                const jwtResponse = await identityService!.refreshToken({
                    jwt: authContext.authState.jwt.token,
                    refreshToken: authContext.authState.refreshToken.token
                });

                if (isIJwtResponse(jwtResponse)) {
                    if (authContext.updateAuthState) {
                        authContext.updateAuthState({
                            jwt: new DecodedJWT(jwtResponse.jwt),
                            refreshToken: new RefreshToken(jwtResponse),
                        });
                    }
                    return jwtResponse.jwt;
                }
            }

            return null;
        }

        this.axios.interceptors.request.use(request => {
            const currentTime = new Date();
            currentTime.setSeconds(currentTime.getSeconds() - 5);

            if (authContext?.authState?.jwt && authContext?.authState.refreshToken) {
                if (authContext.authState.jwt.expiresAt.getTime() < currentTime.getTime()) {
                    return refreshToken().then(jwt => {
                        if (jwt) {
                            setAuthorizationHeader(request, jwt);
                            return request;
                        }
                        return Promise.reject("Failed to get JWT");
                    }).catch(error => {
                        return Promise.reject(error);
                    });
                }
            }

            if (authContext.authState?.jwt) {
                setAuthorizationHeader(request, authContext.authState.jwt.token);
            }

            return request;
        });

        this.axios.interceptors.response.use(response => response, error => {
            if (isAxiosError(error)) {
                if (error.response?.status === 401 &&
                    authContext?.authState?.jwt &&
                    authContext.authState.refreshToken) {

                    return refreshToken().then(jwt => {
                        if (error.config) {
                            error.config.headers['Authorization'] = 'Bearer ' + jwt;
                            return this.axios.request(error.config);
                        }
                        
                        return Promise.reject(error);
                    });
                }
            }

            return Promise.reject(error);
        });
    }
}

function setAuthorizationHeader(request: InternalAxiosRequestConfig, jwt: string) {
    request.headers.Authorization = "Bearer " + jwt;
}