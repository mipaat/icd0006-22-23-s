import { FormEvent, useCallback, useContext, useEffect, useState } from "react";
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

    const [comments, setComments] = useState(null as IComment[] | null);
    const commentsLimit = 50;
    const [commentsPage, setCommentsPage] = useState(0);

    const updateComments = useCallback(async (page: number) => {
        if (!id) return;
        const commentService = new CommentService(authContext);
        setComments(await commentService.getVideoComments(id, commentsLimit, page));
    }, [authContext, id]);

    const onCommentsPageChange = async (page: number) => {
        await updateComments(page);
        setCommentsPage(page);
    };

    const [shouldGetVideoAccessToken, setShouldGetVideoAccessToken] = useState(false);
    const [accessTokenFetched, setAccessTokenFetched] = useState(false);
    const [waitForFirstAccessTokenFetch, setWaitForFirstAccessTokenFetch] = useState(true);

    useEffect(() => {
        let intervalId = null as NodeJS.Timer | null;
        let cancelled = false;
        if (shouldGetVideoAccessToken) {
            if (!authContext.jwt && !authContext.refreshToken) return;
            const fileService = new FileService(authContext);
            fileService.getVideoAccessToken().then(_ => {
                if (cancelled) return;
                if (waitForFirstAccessTokenFetch) {
                    setWaitForFirstAccessTokenFetch(false);
                }
                setAccessTokenFetched(true);
                intervalId = setInterval(async () => {
                    await fileService.getVideoAccessToken();
                }, 55000);
            });
        } else {
            if (intervalId) {
                clearInterval(intervalId);
            }
        }

        return () => {
            cancelled = true;
            if (intervalId) {
                clearInterval(intervalId);
            }
        }
    }, [accessTokenFetched, authContext, shouldGetVideoAccessToken, waitForFirstAccessTokenFetch]);

    useEffect(() => {
        let cancelled = false;
        async function fetchVideo() {
            if (id === undefined) {
                navigate('/notFound');
                return;
            }
            const videoService = new VideoService(authContext);
            const fetchedVideo = await videoService.getById(id);
            if (cancelled) return;
            setInternalPrivacyStatus(fetchedVideo.internalPrivacyStatus);
            if (fetchedVideo.internalPrivacyStatus === ESimplePrivacyStatus.Private) {
                setWaitForFirstAccessTokenFetch(true);
                setShouldGetVideoAccessToken(true);
            } else {
                setWaitForFirstAccessTokenFetch(false);
            }
            setVideo(fetchedVideo);
            if (fetchedVideo.lastCommentsFetch) {
                await updateComments(commentsPage);
            }
        }
        fetchVideo();
        return () => {
            cancelled = true;
        }
        // We don't want to re-fetch video in most cases
        // Like when updating comments page
        // Or even when authState changes? Hopefully fine to ignore?
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
        setShouldGetVideoAccessToken(internalPrivacyStatus === ESimplePrivacyStatus.Private);
        setAccessTokenFetched(false);
        const videoService = new VideoService(authContext);
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
                (!waitForFirstAccessTokenFetch || video.internalPrivacyStatus !== ESimplePrivacyStatus.Private ? <video controls width={560} height={315}>
                    <source src={`${conformApiBaseUrl(config)}v1/File/VideoFileJwt/${video.id}`} />
                </video> : <div style={{ width: 560, height: 315 }} className="text-center">Performing video file fetch</div>)}
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