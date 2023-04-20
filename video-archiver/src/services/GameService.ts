import { IGame } from "../dto/domain/IGame";
import { IAuthenticationContext } from "../dto/IAuthenticationContext";
import { IRestApiErrorResponse, isIRestApiErrorResponse } from "../dto/IRestApiErrorResponse";
import { BaseAuthenticatedService } from "./BaseAuthenticatedService";
import { IdentityService } from "./IdentityService";

export class GameService extends BaseAuthenticatedService {
    constructor(authContext: IAuthenticationContext, identityService: IdentityService | null = null) {
        super("v1/crud/games/", authContext, identityService);
    }

    async getAll(): Promise<IGame[] | IRestApiErrorResponse | undefined> {
        const result = await this.get<IGame[]>("listAll");
        if (!isIRestApiErrorResponse(result) && result !== undefined) {
            for (const game of result) {
                game.lastFetched = new Date(game.lastFetched);
                if (game.lastSuccessfulFetch) {
                    game.lastSuccessfulFetch = new Date(game.lastSuccessfulFetch);
                }
            }
        }
        return result;
    }
}