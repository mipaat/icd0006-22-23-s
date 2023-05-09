export interface IJWTResponse {
    jwt: string,
    refreshToken: string,
    refreshTokenExpiresAt: string
}

export function isIJwtResponse(response: any): response is IJWTResponse {
    if (!response) {
        return false;
    }
    const jwtResponse = response as IJWTResponse;
    return jwtResponse.jwt !== undefined &&
    jwtResponse.refreshToken !== undefined &&
    jwtResponse.refreshTokenExpiresAt !== undefined;
}
