export interface IApiConfig {
    baseUrl: string
}

export interface IConfig {
    api: IApiConfig,
    localStorageKey: string
}

export function conformApiBaseUrl(config: IConfig) {
    const result = config.api.baseUrl;
    if (result.endsWith("api/")) {
        return result;
    }
    if (result.endsWith("api")) {
        return result + "/";
    }
    if (result.endsWith("/")) {
        return result + "api/";
    }
    return result + "/api/";
}
