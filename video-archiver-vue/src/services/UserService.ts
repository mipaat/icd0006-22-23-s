import type { IUserSubAuthor } from "@/dto/IUserSubAuthor";
import { BaseAuthenticatedService } from "./BaseAuthenticatedService";
import type { IdentityService } from "./IdentityService";

export class UserService extends BaseAuthenticatedService {
    constructor(identityService: IdentityService | null = null) {
        super("v1/identity/account/", identityService);
    }

    async listUserSubAuthors(): Promise<IUserSubAuthor[]> {
        const result = await this.get<IUserSubAuthor[]>('listUserSubAuthors');
        return result.data;
    }
}