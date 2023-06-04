import type { EPlatform } from "../enums/EPlatform";
import type { EVideoSortingOptions } from "../enums/EVideoSortingOptions";

export interface IVideoSearchQuery {
    categoryIdsQuery: string[],
    userAuthorId: string | null,
    platformQuery: EPlatform | null,
    nameQuery: string | null,
    authorQuery: string | null,

    page: number,
    limit: number,
    sortingOptions: EVideoSortingOptions,
    descending: boolean,
}