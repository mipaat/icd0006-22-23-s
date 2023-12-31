import { BaseAuthenticatedService, IAxiosRetryConfig } from './BaseAuthenticatedService';
import { IAuthenticationContext } from '../contexts/IAuthenticationContext';
import { IComment } from '../dto/IComment';
import { handleBaseArchiveEntity } from '../utils/Utils';

export class CommentService extends BaseAuthenticatedService {
    constructor(authContext: IAuthenticationContext) {
        super('v1/comment/', authContext);
    }

    async getVideoComments(videoId: string, limit: number, page: number): Promise<IComment[]> {
        const comments = (
            await this.get<IComment[]>(
                `getVideoComments?videoId=${videoId}&limit=${limit}&page=${page}`, {
                    refreshAttempted: false,
                    allowUnauthenticated: true,
                } as IAxiosRetryConfig
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
    handleBaseArchiveEntity(comment);
    for (const reply of comment.replies) {
        handleComment(reply);
    }
}
