import { type IJWTResponse } from "./IJWTResponse";

export interface IRefreshToken {
    token: string,
    expiresAt: Date,
}

export class RefreshToken implements IRefreshToken {
    token: string;
    expiresAt: Date;

    constructor(jwtResponse: IJWTResponse) {
        this.token = jwtResponse.refreshToken;
        this.expiresAt = new Date(jwtResponse.refreshTokenExpiresAt);
    }
}