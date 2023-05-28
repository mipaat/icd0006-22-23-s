import type { IImageFile } from "./IImageFile";
import type { EPlatform } from "./enums/EPlatform";

export interface IAuthor {
    id: string,
    userName: string | null,
    displayName: string | null,
    
    platform: EPlatform,
    idOnPlatform: string,
    profileImages: IImageFile[] | null,
    urlOnPlatform: string | null,
}

export function getNameDisplay(author: IAuthor): string {
    if (!author.displayName) return author.userName ?? author.id;
    if (!author.userName) return author.displayName ?? author.id;
    return `${author.displayName} (${author.userName})`;
}