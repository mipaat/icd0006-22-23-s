import type { IAuthor } from "./IAuthor";
import type { IBaseArchiveEntity } from "./IBaseArchiveEntity";

export interface IComment extends IBaseArchiveEntity {
    id: string,
    content: string,
    author: IAuthor,
    
    createdAt: Date | null,
    deletedAt: Date | null,
    
    replies: IComment[],
    
    likeCount: number | null,
    dislikeCount: number | null,
    isFavorited: number | null,
}