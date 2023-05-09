export interface IRestApiResponse {
    status: number,
}

export function isIRestApiResponse(response: any): response is IRestApiResponse {
    if (!response) {
        return false;
    }
    const restApiResponse = response as IRestApiResponse;
    return restApiResponse.status !== undefined;
}