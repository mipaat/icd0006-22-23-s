import { NavigateFunction } from "react-router-dom";
import { IAuthenticationContext } from "../contexts/IAuthenticationContext";
import { BaseAuthenticatedService } from "./BaseAuthenticatedService";

export class FileService extends BaseAuthenticatedService {
    constructor(authContext: IAuthenticationContext, navigate: NavigateFunction, getLocation: () => Location) {
        super("v1/File/", authContext, navigate, getLocation);
    }

    async getVideoAccessToken(): Promise<void> {
        await this.get("getNewVideoAccessToken", { withCredentials: true, });
    }
}