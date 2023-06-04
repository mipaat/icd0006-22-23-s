import { BaseAuthenticatedService } from "./BaseAuthenticatedService";
import { IAuthenticationContext } from "../contexts/IAuthenticationContext";
import { IUserSubAuthor } from "../dto/identity/IUserSubAuthor";

export class UserService extends BaseAuthenticatedService {
    constructor(authContext: IAuthenticationContext) {
        super("v1/identity/account/", authContext);
    }

    async listUserSubAuthors(): Promise<IUserSubAuthor[]> {
        const result = await this.get<IUserSubAuthor[]>('listUserSubAuthors');
        return result.data;
    }
}