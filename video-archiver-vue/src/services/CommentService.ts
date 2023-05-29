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
    for (const reply of comment.replies) {
        handleComment(reply);
    }
}
