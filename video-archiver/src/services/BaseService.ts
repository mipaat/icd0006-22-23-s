import Axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

import * as configJson from '../config.json';
import IConfig, { conformApiBaseUrl } from '../config';
import { IRestApiErrorResponse } from '../dto/IRestApiErrorResponse';
import { IRestApiResponse } from '../dto/IRestApiResponse';
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

    protected async post<TResponse, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D> | undefined): Promise<TResponse | IRestApiErrorResponse | undefined> {
        try {
            const response = await this.axios.post<TResponse>(url, data, config);
            return response.data;
        } catch (e) {
            const axiosError = e as AxiosError<IRestApiErrorResponse>;
            if (axiosError.response) {
                console.log('Error:', axiosError.message, 'Response:', axiosError.response.data);
                return axiosError.response!.data;
            }

            console.log('error: ', (e as Error).message);
            return undefined;
        }
    }

    protected async delete(url: string, config?: AxiosRequestConfig | undefined): Promise<IRestApiResponse | IRestApiErrorResponse | undefined> {
        try {
            const response = await this.axios.delete(url, config);
            return response;
        } catch (e) {
            const axiosError = e as AxiosError<IRestApiErrorResponse>;
            if (axiosError.response) {
                console.log('Error:', axiosError.message, 'Response:', axiosError.response.data);
                return axiosError.response!.data;
            }

            console.log('error: ', (e as Error).message);
            return undefined;
        }
    }

    protected async get<TResponse>(url: string, config?: AxiosRequestConfig | undefined) {
        try {
            const response = await this.axios.get<TResponse>(url, config);
            return response.data;
        } catch (e) {
            const axiosError = e as AxiosError<IRestApiErrorResponse>;
            if (axiosError.response) {
                console.log('Error:', axiosError.message, 'Response:', axiosError.response.data);
                return axiosError.response!.data;
            }

            console.log('error: ', (e as Error).message);
            return undefined;
        }
    }
}