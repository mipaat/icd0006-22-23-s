import type { IAuthor } from "./IAuthor";

export interface IComment {
    id: string,
    content: string,
    author: IAuthor,
    createdAt: Date | null,
    replies: IComment[],
}