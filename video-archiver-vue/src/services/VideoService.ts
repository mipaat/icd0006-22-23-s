import type { IVideoSearchQuery } from "@/dto/input/IVideoSearchQuery";
import { BaseAuthenticatedService, type IAxiosRetryConfig } from "./BaseAuthenticatedService";
import type { IdentityService } from "./IdentityService";
import type { IVideoSearchResult } from "@/dto/IVideoSearchResult";
import { newLangString } from "@/dto/LangString";

export class VideoService extends BaseAuthenticatedService {
    constructor(identityService: IdentityService | null = null) {
        super("v1/videos/", identityService);
    }

    async search(query: IVideoSearchQuery): Promise<IVideoSearchResult> {
        const params = new URLSearchParams();
        if (query.categoryIdsQuery && query.categoryIdsQuery.length > 0) {
            params.append("categoryIdsQuery", "CATEGORY_IDS_PLACEHOLDER");
        }
        if (query.userAuthorId) {
            params.append("userAuthorId", query.userAuthorId);
        }
        if (query.platformQuery) {
            params.append("platformQuery", query.platformQuery);
        }
        if (query.nameQuery) {
            params.append("nameQuery", query.nameQuery);
        }
        if (query.authorQuery) {
            params.append("authorQuery", query.authorQuery);
        }
        params.append("page", query.page.toString());
        params.append("limit", query.limit.toString());
        params.append("sortingOptions", query.sortingOptions);
        params.append("descending", query.descending.toString());
        let queryString = params.toString();
        if (query.categoryIdsQuery) {
            queryString = queryString.replace("CATEGORY_IDS_PLACEHOLDER", query.categoryIdsQuery.join(","));
        }
        const result = (await this.get<IVideoSearchResult>(`search?${queryString}`)).data;
        for (const video of result.videos) {
            video.title = newLangString(video.title);
        }
        return result;
    }
}