import type { IVideoSearchQuery } from '@/dto/input/IVideoSearchQuery';
import { BaseAuthenticatedService, type IAxiosRetryConfig } from './BaseAuthenticatedService';
import type { IdentityService } from './IdentityService';
import type { IVideoSearchResult } from '@/dto/IVideoSearchResult';
import { newLangString } from '@/dto/LangString';
import type { IVideoWithAuthor } from '@/dto/IVideoWithAuthor';
import type { ESimplePrivacyStatus } from '@/dto/enums/ESimplePrivacyStatus';

export class VideoService extends BaseAuthenticatedService {
    constructor(identityService: IdentityService | null = null) {
        super('v1/videos/', identityService);
    }

    async search(query: IVideoSearchQuery): Promise<IVideoSearchResult> {
        const params = new URLSearchParams();
        const categoryIdsPlaceholder = "CATEGORY_IDS_PLACEHOLDER_2314848d9sfubjhkcxvsdfbhj435gdfsgfdsgfdfr32awerfv"
        if (query.categoryIdsQuery && query.categoryIdsQuery.length > 0) {
            params.append('categoryIdsQuery', categoryIdsPlaceholder);
        }
        if (query.userAuthorId) {
            params.append('userAuthorId', query.userAuthorId);
        }
        if (query.platformQuery) {
            params.append('platformQuery', query.platformQuery);
        }
        if (query.nameQuery) {
            params.append('nameQuery', query.nameQuery);
        }
        if (query.authorQuery) {
            params.append('authorQuery', query.authorQuery);
        }
        params.append('page', query.page.toString());
        params.append('limit', query.limit.toString());
        params.append('sortingOptions', query.sortingOptions);
        params.append('descending', query.descending.toString());
        let queryString = params.toString();
        if (query.categoryIdsQuery) {
            queryString = queryString.replace(
                categoryIdsPlaceholder,
                query.categoryIdsQuery.join(',')
            );
        }
        const result = (await this.get<IVideoSearchResult>(`search?${queryString}`)).data;
        for (const video of result.videos) {
            video.title = newLangString(video.title);
        }
        return result;
    }

    async getById(id: string): Promise<IVideoWithAuthor> {
        const video = (await this.get<IVideoWithAuthor>(`getById?id=${id}`)).data;
        video.title = newLangString(video.title);
        video.description = newLangString(video.description);
        if (video.publishedAt) {
            video.publishedAt = new Date(video.publishedAt);
        }
        if (video.createdAt) {
            video.createdAt = new Date(video.createdAt);
        }
        if (video.updatedAt) {
            video.updatedAt = new Date(video.updatedAt);
        }
        return video;
    }

    async setPrivacyStatus(id: string, status: ESimplePrivacyStatus): Promise<void> {
        await this.put(`setPrivacyStatus?id=${id}`, { status: status });
    }
}
