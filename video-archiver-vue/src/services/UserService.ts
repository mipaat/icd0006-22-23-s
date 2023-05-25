import type { IUserSubAuthor } from "@/dto/IUserSubAuthor";
import { BaseAuthenticatedService } from "./BaseAuthenticatedService";
import type { IdentityService } from "./IdentityService";
import type { IRestApiErrorResponse } from "@/dto/IRestApiErrorResponse";
import { isAxiosResponse } from "@/utils/Utils";

export class UserService extends BaseAuthenticatedService {
    constructor(identityService: IdentityService | null = null) {
        super("v1/identity/account/", identityService);
    }

    async listUserSubAuthors(): Promise<IUserSubAuthor[] | IRestApiErrorResponse | undefined> {
        const result = await this.get<IUserSubAuthor[]>('listUserSubAuthors');
        if (isAxiosResponse<IUserSubAuthor[]>(result)) {
            return result.data;
        }
        return result;
    }
}