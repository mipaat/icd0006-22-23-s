import type { IAuthor } from "./IAuthor";
import type { IImageFile } from "./IImageFile";
import type { ITimeSpan } from "./ITimeSpan";
import type { LangString } from "./LangString";
import type { EPlatform } from "./enums/EPlatform";
import type { EPrivacyStatus } from "./enums/EPrivacyStatus";
import type { ESimplePrivacyStatus } from "./enums/ESimplePrivacyStatus";

export interface IBasicVideoWithAuthor {
    id: string,
    title: LangString | null,
    isAvailable: boolean,
    privacyStatus: EPrivacyStatus | null,
    internalPrivacyStatus: ESimplePrivacyStatus | null,
    thumbnails: IImageFile[] | null,
    thumbnail: IImageFile | null,
    duration: string | null,
    platform: EPlatform,
    idOnPlatform: string,
    author: IAuthor,

    createdAt: Date | null,
    publishedAt: Date | null,
    addedToArchiveAt: Date,
}