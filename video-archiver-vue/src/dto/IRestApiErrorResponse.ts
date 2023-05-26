import type { ERestApiErrorType } from "./ERestApiErrorType";

export interface IRestApiErrorResponse {
    errorType: ERestApiErrorType,
    error: string,
}

export function isIRestApiErrorResponse(response: any): response is IRestApiErrorResponse {
    if (!response) {
        return false;
    }
    const restApiErrorResponse = response as IRestApiErrorResponse;
    return restApiErrorResponse.error !== undefined &&
        restApiErrorResponse.errorType !== undefined;
}