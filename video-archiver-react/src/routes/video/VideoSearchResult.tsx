import { IVideoSearchResult } from "../../dto/IVideoSearchResult";

interface IProps {
    searchResult: IVideoSearchResult | null,
}

const VideoSearchResult = (props: IProps) => {
    if (!props.searchResult?.videos) {
        return <div>LOADING VIDEOS</div>
    }
    return <> {props.searchResult.videos.map((video, index) => {
        return <div>{video.id}</div>
    })}
    </>
}

export default VideoSearchResult;