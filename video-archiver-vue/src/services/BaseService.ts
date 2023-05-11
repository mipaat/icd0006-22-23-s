import Axios, { isAxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';

import * as configJson from '../config.json';
import { isIRestApiErrorResponse, type IRestApiErrorResponse } from '../dto/IRestApiErrorResponse';
import { conformApiBaseUrl, type IConfig } from '@/config';
const config = configJson as IConfig;

export abstract class BaseService {
    private static hostBaseURL = conformApiBaseUrl(config);

    protected axios: AxiosInstance;

    constructor(baseUrl: string) {
        this.axios = Axios.create(
            {
                baseURL: BaseService.hostBaseURL + baseUrl,
                headers: {
                    common: {
                        'Content-Type': 'application/json'
                    }
                }
            }
        )

        this.axios.interceptors.request.use(request => {
            console.log('Starting Request', JSON.stringify(request, null, 2));
            return request;
        })
    }

    private async baseRequest<TResponse>(requestFunc: () => Promise<AxiosResponse<TResponse>>): Promise<AxiosResponse<TResponse> | IRestApiErrorResponse | undefined> {
        try {
            const response = await requestFunc();
            return response;
        } catch (e) {
            if (isAxiosError<IRestApiErrorResponse>(e)) {
                if (e.response) {
                    if (isIRestApiErrorResponse(e.response.data)) {
                        console.log('Error:', e.message, 'Response:', e.response.data);
                    return e.response.data;
                    }
                }
            }

            console.log('Error:', (e as Error).message);
            return undefined;
        }
    }

    protected async post<TResponse, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D> | undefined): Promise<AxiosResponse<TResponse> | IRestApiErrorResponse | undefined> {
        return await this.baseRequest(() => this.axios.post<TResponse>(url, data, config));
    }

    protected async delete(url: string, config?: AxiosRequestConfig | undefined): Promise<AxiosResponse | IRestApiErrorResponse | undefined> {
        return await this.baseRequest(() => this.axios.delete(url, config));
    }

    protected async get<TResponse>(url: string, config?: AxiosRequestConfig | undefined): Promise<AxiosResponse<TResponse> | IRestApiErrorResponse | undefined> {
        return await this.baseRequest(() => this.axios.get<TResponse>(url, config));
    }
}