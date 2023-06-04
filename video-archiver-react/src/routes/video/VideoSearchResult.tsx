import AuthorSummary from "../../components/AuthorSummary";
import LangStringDisplay from "../../components/LangStringDisplay";
import { IVideoSearchResult } from "../../dto/IVideoSearchResult";

interface IProps {
    searchResult: IVideoSearchResult | null,
}

const VideoSearchResult = (props: IProps) => {
    if (!props.searchResult?.videos) {
        return <div>LOADING VIDEOS</div>
    }
    return <div>
        <table className="table">
            <thead>
                <tr>
                    <th>Video</th>
                    <th>Author</th>
                    <th>Thumbnail</th>
                    <th>Duration</th>
                    <th>Created at</th>
                    <th>Added to archive at</th>
                </tr>
            </thead>
            <tbody>
                {props.searchResult.videos.map(video => {
                    return (<tr key={video.id}>
                        <td>TODO link <LangStringDisplay langString={video.title}/></td>
                        <td>
                            <AuthorSummary author={video.author} />
                        </td>
                        <td>
                            {video.thumbnail ?
                            <img src={video.thumbnail.url} loading="lazy" width={160} height={90} alt="Thumbnail" /> :
                            <div>No thumbnails</div>}
                        </td>
                        <td>{video.duration}</td>
                        <td>{(video.publishedAt ?? video.createdAt)?.toLocaleString()}</td>
                        <td>{video.addedToArchiveAt.toLocaleString()}</td>
                    </tr>);
                })}
            </tbody>
        </table>
    </div>
}

export default VideoSearchResult;