import { IAuthenticationState } from "../dto/IAuthenticationState";
import { IJWTResponse } from "../dto/IJWTResponse";
import { ILoginData } from "../dto/ILoginData";
import { IRefreshTokenData } from "../dto/IRefreshTokenData";
import { IRegisterData } from "../dto/IRegisterData";
import { IRestApiErrorResponse } from "../dto/IRestApiErrorResponse";
import { PendingApprovalError } from "../dto/PendingApprovalError";
import { isAxiosResponse } from "../utils/Utils";
import { BaseService } from "./BaseService";

export class IdentityService extends BaseService {
    constructor() {
        super('v1/identity/account/');
    }

    async register(data: IRegisterData): Promise<IJWTResponse | IRestApiErrorResponse | undefined> {
        const result = await this.post<IJWTResponse>('register', data);
        if (isAxiosResponse(result)) {
            if (result.status === 202) {
                throw new PendingApprovalError();
            }
            return result.data;
        }
        return result;
    }

    async login(data: ILoginData): Promise<IJWTResponse | IRestApiErrorResponse | undefined> {
        const result = await this.post<IJWTResponse>('login', data);
        if (isAxiosResponse<IJWTResponse>(result)) {
            return result.data;
        }
        return result;
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
        const result = await this.post<IJWTResponse>('refreshToken', data);
        if (isAxiosResponse<IJWTResponse>(result)) {
            return result.data;
        }
        return result;
    }
}