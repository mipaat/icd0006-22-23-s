import { IAuthenticationContext } from "../contexts/IAuthenticationContext";
import { BaseAuthenticatedService } from "./BaseAuthenticatedService";

export class FileService extends BaseAuthenticatedService {
    constructor(authContext: IAuthenticationContext) {
        super("v1/File/", authContext);
    }

    async getVideoAccessToken(): Promise<void> {
        await this.get("getNewVideoAccessToken", { withCredentials: true, });
    }
}