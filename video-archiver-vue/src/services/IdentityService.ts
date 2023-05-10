import type { IRefreshToken } from '@/dto/IRefreshToken';
import { type IJWTResponse } from '../dto/IJWTResponse';
import { type IRefreshTokenData } from '../dto/IRefreshTokenData';
import { type IRestApiErrorResponse } from '../dto/IRestApiErrorResponse';
import { BaseService } from './BaseService';

export class IdentityService extends BaseService {
    constructor() {
        super('v1/identity/account/');
    }

    async register(
        username: string,
        password: string
    ): Promise<IJWTResponse | IRestApiErrorResponse | undefined> {
        return await this.post<IJWTResponse>('register', { username, password });
    }

    async login(username: string, password: string): Promise<IJWTResponse | IRestApiErrorResponse | undefined> {
        return await this.post<IJWTResponse>('login', {username: username, password});
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
        return await this.post<IJWTResponse>('refreshToken', data);
    }
}
