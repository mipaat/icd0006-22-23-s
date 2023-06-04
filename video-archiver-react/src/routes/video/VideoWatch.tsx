import { FormEvent, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IVideoWithAuthor } from "../../dto/IVideoWithAuthor";
import { VideoService } from "../../services/VideoService";
import { AuthContext } from "../Root";
import { ESimplePrivacyStatus } from "../../dto/enums/ESimplePrivacyStatus";
import { FileService } from "../../services/FileService";
import { CommentService } from "../../services/CommentService";
import { IComment } from "../../dto/IComment";
import { type IConfig, conformApiBaseUrl } from "../../config";
import * as configJson from '../../config.json';
import AuthorSummary from "../../components/AuthorSummary";
import LangStringDisplay from "../../components/LangStringDisplay";
import SelectListOptions from "../../components/SelectListOptions";
import PaginationComponent from "../../components/PaginationComponent";
import CommentComponent from "../../components/CommentComponent";

const config = configJson as IConfig;

const VideoWatch = () => {
    let { id } = useParams();
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const [video, setVideo] = useState(null as IVideoWithAuthor | null);

    const [embedView, setEmbedView] = useState(false);
    const [internalPrivacyStatus, setInternalPrivacyStatus] = useState(null as ESimplePrivacyStatus | null);

    const videoService = useMemo(() => new VideoService(authContext), [authContext]);

    const fileService = useMemo(() => new FileService(authContext), [authContext]);

    const [comments, setComments] = useState(null as IComment[] | null);
    const commentsLimit = 50;
    const [commentsPage, setCommentsPage] = useState(0);

    const updateComments = useCallback(async (page: number) => {
        if (!id) return;
        const commentService = new CommentService(authContext);
        setComments(await commentService.getVideoComments(id, commentsLimit, page));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authContext, id]);

    const onCommentsPageChange = async (page: number) => {
        await updateComments(page);
        setCommentsPage(page);
    };

    useEffect(() => {
        let videoAccessTokenTimer = null as NodeJS.Timer | null;
        async function fetchVideo() {
            if (id === undefined) {
                navigate('/notFound');
                return;
            }
            const fetchedVideo = await videoService.getById(id);
            setInternalPrivacyStatus(fetchedVideo.internalPrivacyStatus);
            if (fetchedVideo.internalPrivacyStatus === ESimplePrivacyStatus.Private) {
                await fileService.getVideoAccessToken();
                videoAccessTokenTimer = setInterval(() => fileService.getVideoAccessToken(), 55000);
            }
            setVideo(fetchedVideo);
            if (fetchedVideo.lastCommentsFetch) {
                await updateComments(commentsPage);
            }
        }
        fetchVideo();

        return () => {
            if (videoAccessTokenTimer) {
                clearInterval(videoAccessTokenTimer);
            }
        }
        // We don't want to re-fetch video in most cases
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, navigate]);

    const videoCanBeEmbedded = (video: IVideoWithAuthor) => {
        return video.embedUrl != null || video.url != null;
    }

    const showEmbedView = (video: IVideoWithAuthor) => {
        return embedView && videoCanBeEmbedded(video);
    }

    const submitPrivacyStatus = async (event: MouseEvent | FormEvent | Event) => {
        event.preventDefault();
        if (!video || !internalPrivacyStatus) return;
        await videoService.setPrivacyStatus(video.id, internalPrivacyStatus);
        setVideo(previous => {
            return { ...previous, internalPrivacyStatus } as IVideoWithAuthor;
        });
    }

    if (!video) return <div>LOADING...</div>
    return <div>
        {videoCanBeEmbedded(video) ?
            <button className="btn btn-primary" onClick={_ => setEmbedView(!embedView)}>
                {embedView ? "View archived version" : "View on platform"}
            </button> : <></>}
        <div>
            {showEmbedView(video) ?
                <iframe width={560} height={315}
                    src={video.embedUrl ?? video.url ?? undefined}
                    title={`${video.platform} video player`}
                    allowFullScreen
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture;" /> :
                <video controls width={560} height={315}>
                    <source src={`${conformApiBaseUrl(config)}v1/File/VideoFileJwt/${video.id}`} />
                </video>}
            <AuthorSummary author={video.author} />
            <br />
            <h1><LangStringDisplay langString={video.title} /></h1>
        </div>
        <div>
            {authContext.jwt?.isAdmin ?
                <form onSubmit={submitPrivacyStatus}>
                    <label htmlFor="status">Set privacy status (in archive)</label>
                    <select id="status"
                        value={internalPrivacyStatus!}
                        onChange={e => setInternalPrivacyStatus(e.target.value as ESimplePrivacyStatus)}>
                        <SelectListOptions<ESimplePrivacyStatus>
                            values={Object.values(ESimplePrivacyStatus)} />
                    </select>
                    <input type="submit" className="btn btn-primary" value="Submit" />
                </form> : <></>}
            <span className="card card-body" style={{ whiteSpace: "pre-wrap" }}>
                <LangStringDisplay langString={video.description} />
            </span>
        </div>
        {comments ?
            <div>
                <h4>Comments</h4>
                {video.lastCommentsFetch ?
                    <h6>Last fetched: {video.lastCommentsFetch.toLocaleString()}</h6> : <></>}
                Comments on platform: {video.commentCount}
                Archived root comments: {video.archivedRootCommentCount}
                Archived total comments: {video.archivedCommentCount}
                <PaginationComponent
                    page={commentsPage}
                    limit={commentsLimit}
                    total={video.archivedRootCommentCount}
                    amountOnPage={comments.length}
                    onPageChange={onCommentsPageChange} />
                {comments.map(comment => {
                    return <CommentComponent key={comment.id} comment={comment} />
                })}
            </div>
            : (video.lastCommentsFetch ?
                <div>Loading comments...</div> :
                <div><h4>Comments not archived yet</h4></div>)}
    </div>
}

export default VideoWatch;