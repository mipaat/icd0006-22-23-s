interface IApiConfig {
    baseUrl: string
}

interface IConfig {
    api: IApiConfig,
    localStorageKey: string
}

export function conformApiBaseUrl(config: IConfig) {
    let result = config.api.baseUrl;
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

export default IConfig;
