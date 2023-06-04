import { DecodedJWT } from "../dto/identity/DecodedJWT";
import { IRefreshToken } from "../dto/identity/IRefreshToken";
import { IUserSubAuthor } from "../dto/identity/IUserSubAuthor";
import { SimpleSetStateAction } from "../utils/Utils";

export interface IAuthenticationContext {
    jwt: DecodedJWT | null,
    setJwt: SimpleSetStateAction<DecodedJWT | null> | null,
    refreshToken: IRefreshToken | null,
    setRefreshToken: SimpleSetStateAction<IRefreshToken | null> | null,
    selectedAuthor: IUserSubAuthor | null,
    setSelectedAuthor: SimpleSetStateAction<IUserSubAuthor | null> | null,

    ongoingRefreshPromise: Promise<string | null> | null,
    setOngoingRefreshPromise: SimpleSetStateAction<Promise<string | null> | null> | null,
}

export function isRefreshTokenExpired(authContext: IAuthenticationContext): boolean {
    if (!authContext.refreshToken) return true;
    return authContext.refreshToken.expiresAt.getTime() < new Date().getTime() + 5000;
}

export function isJwtExpired(authContext: IAuthenticationContext): boolean {
    if (!authContext.jwt) return true;
    return authContext.jwt.expiresAt.getTime() < new Date().getTime() + 5000;
}