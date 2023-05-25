import type { IRefreshToken } from '@/dto/IRefreshToken';
import { type IJWTResponse } from '../dto/IJWTResponse';
import { type IRefreshTokenData } from '../dto/IRefreshTokenData';
import { type IRestApiErrorResponse } from '../dto/IRestApiErrorResponse';
import { BaseService } from './BaseService';
import { isAxiosResponse } from '@/utils/Utils';
import { PendingApprovalError } from '@/dto/PendingApprovalError';
import type { IUserSubAuthor } from '@/dto/IUserSubAuthor';

export class IdentityService extends BaseService {
    constructor() {
        super('v1/identity/account/');
    }

    async register(
        username: string,
        password: string
    ): Promise<IJWTResponse | IRestApiErrorResponse | undefined> {
        const result = await this.post<IJWTResponse>('register', { username, password });
        if (isAxiosResponse(result)) {
            if (result.status === 202) {
                throw new PendingApprovalError();
            }
            return result.data;
        }
        return result;
    }

    async login(username: string, password: string): Promise<IJWTResponse | IRestApiErrorResponse | undefined> {
        const result = await this.post<IJWTResponse>('login', {username: username, password});
        if (isAxiosResponse<IJWTResponse>(result)) {
            return result.data;
        }
        return result;
    }

    async logout(refreshToken: IRefreshToken, jwt: string): Promise<void> {
        await this.post('logout', refreshToken, {
            headers: {
                Authorization: 'Bearer ' + jwt
            }
        });
    }

    async refreshToken(
        data: IRefreshTokenData
    ): Promise<IJWTResponse | IRestApiErrorResponse | undefined> {
        const result = await this.post<IJWTResponse>('refreshToken', data);
        if (isAxiosResponse<IJWTResponse>(result)) {
            return result.data;
        }
        return result;
    }
}
