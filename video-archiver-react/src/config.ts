export interface IConfig {
    apiBaseUrl: string,
}

export function conformApiBaseUrl(config: IConfig) {
    const result = config.apiBaseUrl;
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
