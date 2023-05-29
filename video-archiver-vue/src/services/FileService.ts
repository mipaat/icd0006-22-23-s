import { BaseAuthenticatedService } from "./BaseAuthenticatedService";
import type { IdentityService } from "./IdentityService";

export class FileService extends BaseAuthenticatedService {
    constructor(identityService: IdentityService | null = null) {
        super("v1/File/", identityService);
    }

    async getVideoAccessToken(): Promise<void> {
        await this.get("getNewVideoAccessToken", { withCredentials: true, });
    }
}