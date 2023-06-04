import type { IAuthor } from "./IAuthor";
import type { LangString } from "./LangString";
import type { EPlatform } from "./enums/EPlatform";

export interface ICategoryWithCreator {
    id: string,
    name: LangString,
    isPublic: boolean,
    isAssignable: boolean,
    platform: EPlatform,
    idOnPlatform: string | null,
    creator: IAuthor | null,
}