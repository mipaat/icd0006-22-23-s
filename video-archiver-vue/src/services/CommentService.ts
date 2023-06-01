import type { IComment } from '@/dto/IComment';
import { BaseAuthenticatedService } from './BaseAuthenticatedService';
import type { IdentityService } from './IdentityService';

export class CommentService extends BaseAuthenticatedService {
    constructor(identityService: IdentityService | null = null) {
        super('v1/comment/', identityService);
    }

    async getVideoComments(videoId: string, limit: number, page: number): Promise<IComment[]> {
        const comments = (
            await this.get<IComment[]>(
                `getVideoComments?videoId=${videoId}&limit=${limit}&page=${page}`
            )
        ).data;
        for (const comment of comments) {
            handleComment(comment);
        }
        return comments;
    }
}

function handleComment(comment: IComment): void {
    if (comment.createdAt) {
        comment.createdAt = new Date(comment.createdAt);
    }
    if (comment.deletedAt) {
        comment.deletedAt = new Date(comment.deletedAt);
    }
    if (comment.addedToArchiveAt) {
        comment.addedToArchiveAt = new Date(comment.addedToArchiveAt);
    }
    if (comment.lastFetchOfficial) {
        comment.lastFetchOfficial = new Date(comment.lastFetchOfficial);
    }
    if (comment.lastSuccessfulFetchOfficial) {
        comment.lastSuccessfulFetchOfficial = new Date(comment.lastSuccessfulFetchOfficial);
    }
    if (comment.lastFetchUnofficial) {
        comment.lastFetchUnofficial = new Date(comment.lastFetchUnofficial);
    }
    if (comment.lastSuccessfulFetchUnofficial) {
        comment.lastSuccessfulFetchUnofficial = new Date(comment.lastSuccessfulFetchUnofficial);
    }
    for (const reply of comment.replies) {
        handleComment(reply);
    }
}
