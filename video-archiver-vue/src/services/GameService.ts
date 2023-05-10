import { type IGame } from "../dto/domain/IGame";
import { type IGameData } from "../dto/domain/IGameData";
import { type IRestApiErrorResponse, isIRestApiErrorResponse } from "../dto/IRestApiErrorResponse";
import { type IRestApiResponse, isIRestApiResponse } from "../dto/IRestApiResponse";
import { BaseAuthenticatedService } from "./BaseAuthenticatedService";
import { IdentityService } from "./IdentityService";

export class GameService extends BaseAuthenticatedService {
    constructor(identityService: IdentityService | null = null) {
        super("v1/crud/games/", identityService);
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

    async getById(id: string): Promise<IGame | IRestApiErrorResponse | undefined> {
        const result = await this.get<IGame>("GetById", {params: {id: id}});
        if (!isIRestApiErrorResponse(result) && result !== undefined) {
            result.lastFetched = new Date(result.lastFetched);
            if (result.lastSuccessfulFetch) {
                result.lastSuccessfulFetch = new Date(result.lastSuccessfulFetch);
            }
        }
        return result;
    }

    async deleteById(id: string): Promise<boolean> {
        const result = await this.delete("Delete", {params: {id: id}});
        if (isIRestApiResponse(result)) {
            return result.status === 200;
        }
        return false;
    }

    async update(data: IGame): Promise<string | null> {
        const result = await this.post<IRestApiResponse>("Update", data);
        console.log("HERE", result);
        if (isIRestApiResponse(result)) {
            if (result.status === 200) {
                return null;
            }
        }
        if (isIRestApiErrorResponse(result)) {
            return result.error;
        }
        return "Unknown error";
    }

    async create(data: IGameData) {
        const result = await this.post<IRestApiResponse>("Create", data);
        if (isIRestApiResponse(result)) {
            if (result.status === 200) {
                return null;
            }
        }
        if (isIRestApiErrorResponse(result)) {
            return result.error;
        }
        return "Unknown error";
    }
}