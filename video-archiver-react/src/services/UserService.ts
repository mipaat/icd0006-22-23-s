import { BaseAuthenticatedService } from "./BaseAuthenticatedService";
import { IAuthenticationContext } from "../contexts/IAuthenticationContext";
import { NavigateFunction } from "react-router-dom";
import { IUserSubAuthor } from "../dto/identity/IUserSubAuthor";

export class UserService extends BaseAuthenticatedService {
    constructor(authContext: IAuthenticationContext, navigate: NavigateFunction, getLocation: () => Location) {
        super("v1/identity/account/", authContext, navigate, getLocation);
    }

    async listUserSubAuthors(): Promise<IUserSubAuthor[]> {
        const result = await this.get<IUserSubAuthor[]>('listUserSubAuthors');
        return result.data;
    }
}