import { DecodedJWT } from "../dto/DecodedJWT";
import { IAuthenticationContext } from "../dto/IAuthenticationContext";
import { isIJwtResponse } from "../dto/IJWTResponse";
import { RefreshToken } from "../dto/IRefreshToken";
import { BaseService } from "./BaseService";
import { IdentityService } from "./IdentityService";

export class BaseAuthenticationService extends BaseService {
    constructor(baseUrl: string, authContext: IAuthenticationContext, identityService: IdentityService | null = null) {
        super(baseUrl);

        identityService ??= new IdentityService();

        this.axios.interceptors.request.use(async request => {
            const currentTime = new Date();
            currentTime.setSeconds(currentTime.getSeconds() - 5);

            if (authContext?.authState?.jwt && authContext?.authState.refreshToken) {
                if (authContext.authState.jwt.expiresAt.getTime() < currentTime.getTime()) {
                    const jwtResponse = await identityService!.refreshToken({
                        jwt: authContext.authState.jwt.token,
                        refreshToken: authContext.authState.refreshToken!.token
                    });

                    if (isIJwtResponse(jwtResponse) && authContext.updateAuthState) {
                        authContext.updateAuthState({
                            jwt: new DecodedJWT(jwtResponse.jwt),
                            refreshToken: new RefreshToken(jwtResponse),
                        });
                    }
                }
            }

            if (authContext?.authState?.jwt) {
                request.headers.Authorization = "Bearer: " + authContext.authState.jwt.token;
            }

            return request;
        });
    }
}