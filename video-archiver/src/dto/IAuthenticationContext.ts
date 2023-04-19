import { SetStateAction } from "react";
import { IAuthenticationState } from "./IAuthenticationState";

export interface IAuthenticationContext {
    authState: IAuthenticationState | null,
    updateAuthState: ((value: SetStateAction<IAuthenticationState>) => void) | null,
}