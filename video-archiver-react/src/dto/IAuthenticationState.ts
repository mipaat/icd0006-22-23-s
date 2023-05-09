import { DecodedJWT } from "./DecodedJWT";
import { IRefreshToken } from "./IRefreshToken";

export interface IAuthenticationState {
    jwt: DecodedJWT | null,
    refreshToken: IRefreshToken | null,
}