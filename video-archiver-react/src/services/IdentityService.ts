import { IAuthenticationState } from "../dto/IAuthenticationState";
import { IJWTResponse } from "../dto/IJWTResponse";
import { ILoginData } from "../dto/ILoginData";
import { IRefreshTokenData } from "../dto/IRefreshTokenData";
import { IRegisterData } from "../dto/IRegisterData";
import { IRestApiErrorResponse } from "../dto/IRestApiErrorResponse";
import { BaseService } from "./BaseService";

export class IdentityService extends BaseService {
    constructor() {
        super('v1/identity/account/');
    }

    async register(data: IRegisterData): Promise<IJWTResponse | IRestApiErrorResponse | undefined> {
        return await this.post<IJWTResponse>('register', data);
    }

    async login(data: ILoginData): Promise<IJWTResponse | IRestApiErrorResponse | undefined> {
        return await this.post<IJWTResponse>('login', data);
    }

    async logout(authState: IAuthenticationState): Promise<void> {
        await this.post(
            'logout',
            authState.refreshToken,
            {
                headers: {
                    'Authorization': 'Bearer ' + authState.jwt?.token
                }
            }
        );
    }

    async refreshToken(data: IRefreshTokenData): Promise<IJWTResponse | IRestApiErrorResponse | undefined> {
        return await this.post<IJWTResponse>('refreshToken', data);
    }
}