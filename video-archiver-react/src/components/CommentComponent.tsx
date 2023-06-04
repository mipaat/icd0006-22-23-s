import { IComment } from "../dto/IComment";
import AuthorSummary from "./AuthorSummary";

interface IProps {
    comment: IComment
}

const CommentComponent = (props: IProps) => {
    const comment = props.comment;
    return <>
        <AuthorSummary author={comment.author} />
        {comment.createdAt ? <div>{comment.createdAt.toLocaleString()}</div> : <></>}
        {comment.deletedAt ?
            <div className="text-danger">
                Deleted: {comment.deletedAt.toLocaleString()}
            </div> : <></>}
        <div style={{ whiteSpace: "pre-wrap" }}>{comment.content}</div>
        {comment.likeCount !== null ?
            <div>Likes: {comment.likeCount}</div> : <></>}
        {comment.replies && comment.replies.length > 0 ?
            <div>
                <button type="button" className="btn btn-primary"
                    data-bs-toggle="collapse"
                    data-bs-target={`#comment-${comment.id}-collapse`}
                    aria-expanded="false"
                    aria-controls={`comment-${comment.id}-collapse`}>
                    Replies ({comment.replies.length})
                </button>
                <div className="collapse ms-4"
                    id={`comment-${comment.id}-collapse`}>
                    {comment.replies.map(reply => {
                        return <CommentComponent
                            key={reply.id}
                            comment={reply} />
                    })}
                </div>
            </div> : <></>}
    </>
}

export default CommentComponent;