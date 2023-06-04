import { type IJWTResponse } from '../dto/identity/IJWTResponse';
import { type IRefreshTokenData } from '../dto/identity/IRefreshTokenData';
import { BaseService } from './BaseService';
import { isAxiosResponse } from '../utils/Utils';
import { PendingApprovalError } from '../dto/PendingApprovalError';
import { IRefreshToken } from '../dto/identity/IRefreshToken';
import { DecodedJWT } from '../dto/identity/DecodedJWT';

export class IdentityService extends BaseService {
    constructor() {
        super('v1/identity/account/');
    }

    async register(
        username: string,
        password: string
    ): Promise<IJWTResponse> {
        const result = await this.post<IJWTResponse>('register', { username, password });
        if (isAxiosResponse(result)) {
            if (result.status === 202) {
                throw new PendingApprovalError();
            }
            return result.data;
        }
        return result;
    }

    async login(username: string, password: string): Promise<IJWTResponse> {
        const result = await this.post<IJWTResponse>('login', { username: username, password });
        if (isAxiosResponse<IJWTResponse>(result)) {
            return result.data;
        }
        return result;
    }

    async logout(jwt: DecodedJWT, refreshToken: IRefreshToken): Promise<void> {
        await this.post('logout', { refreshToken: refreshToken.token, jwt: jwt.token });
    }

    async refreshToken(
        data: IRefreshTokenData
    ): Promise<IJWTResponse> {
        const result = await this.post<IJWTResponse>('refreshToken', data);
        if (isAxiosResponse<IJWTResponse>(result)) {
            return result.data;
        }
        return result;
    }
}
