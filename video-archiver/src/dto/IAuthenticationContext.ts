import { IAuthenticationState } from "./IAuthenticationState";

export interface IAuthenticationContext {
    authState: IAuthenticationState | null,
    updateAuthState: ((updateFunc: ((previousAuthState: IAuthenticationState) => IAuthenticationState)) => void) | null,
}