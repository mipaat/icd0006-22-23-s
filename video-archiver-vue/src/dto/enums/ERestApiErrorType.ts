export enum ERestApiErrorType {
    UserAlreadyRegistered = "UserAlreadyRegistered",
    InvalidLoginCredentials = "InvalidLoginCredentials",
    UserNotFound = "UserNotFound",
    UserNotApproved = "UserNotApproved",

    InvalidTokenExpirationRequested = "InvalidTokenExpirationRequested",
    InvalidJwt = "InvalidJwt",
    InvalidRefreshToken = "InvalidRefreshToken",

    UnrecognizedUrl = "UnrecognizedUrl",
}