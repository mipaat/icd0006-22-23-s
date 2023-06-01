import type { IAuthor } from "./IAuthor";
import type { IBaseArchiveEntity } from "./IBaseArchiveEntity";
import type { LangString } from "./LangString";
import type { EPlatform } from "./enums/EPlatform";
import type { EPrivacyStatus } from "./enums/EPrivacyStatus";
import type { ESimplePrivacyStatus } from "./enums/ESimplePrivacyStatus";

export interface IVideoWithAuthor extends IBaseArchiveEntity {
    id: string,
    title: LangString | null,
    description: LangString | null,
    url: string | null,
    embedUrl: string | null,
    isAvailable: boolean,
    privacyStatus: EPrivacyStatus | null,
    internalPrivacyStatus: ESimplePrivacyStatus,
    viewCount: number | null,
    likeCount: number | null,
    publishedAt: Date | null,
    createdAt: Date | null,
    updatedAt: Date | null,
    platform: EPlatform,
    idOnPlatform: string,
    commentCount: number | null,
    archivedCommentCount: number,
    archivedRootCommentCount: number,
    author: IAuthor,
    lastCommentsFetch: Date | null,
}