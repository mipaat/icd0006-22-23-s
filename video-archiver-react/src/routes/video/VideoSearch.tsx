import { useCallback, useContext, useEffect, useState } from "react";
import { IVideoSearchResult } from "../../dto/IVideoSearchResult";
import { VideoService } from "../../services/VideoService";
import { AuthContext } from "../Root";
import { IVideoSearchQuery } from "../../dto/input/IVideoSearchQuery";
import VideoSearchResult from "../../components/video/search/VideoSearchResult";
import { EVideoSortingOptions } from "../../dto/enums/EVideoSortingOptions";
import VideoSearchForm from "../../components/video/search/VideoSearchForm";
import { UpdateStateArg, handleChangeEvent } from "../../utils/Utils";
import PaginationComponent from "../../components/PaginationComponent";

const VideoSearch = () => {
    const authContext = useContext(AuthContext);
    const [searchResult, setSearchResult] = useState(null as IVideoSearchResult | null);
    const [query, setQuery] = useState({
        nameQuery: "",
        authorQuery: "",
        categoryIdsQuery: [] as string[],
        userAuthorId: authContext.selectedAuthor?.id,
        platformQuery: null,

        page: 0,
        limit: 50,
        sortingOptions: EVideoSortingOptions.CreatedAt,
        descending: true,
    } as IVideoSearchQuery);

    const updateCategoryIds = (updateFunc: UpdateStateArg<string[]>) => {
        setQuery(previous => {
            const updated = { ...previous };
            updated.categoryIdsQuery = updateFunc(previous.categoryIdsQuery);
            return updated;
        });
    }

    const onSubmit = async () => {
        await fetchAndSetVideos();
    }

    const fetchAndSetVideos = useCallback(async () => {
        const videoService = new VideoService(authContext);
        setSearchResult(await videoService.search(query));
    }, [authContext, query]);

    useEffect(() => {
        fetchAndSetVideos();
    }, [authContext, fetchAndSetVideos]);

    const onPageChange = async (page: number) => {
        setQuery(previous => {
            return { ...previous, page: page };
        })
    }

    return <>
        <VideoSearchForm
            query={query}
            handleChange={e => handleChangeEvent(e, setQuery)}
            updateCategoryIds={updateCategoryIds}
            onSubmit={onSubmit} />
        <PaginationComponent
            page={query.page}
            limit={query.limit}
            total={null}
            amountOnPage={searchResult?.videos.length ?? 0}
            onPageChange={onPageChange} />
        <VideoSearchResult searchResult={searchResult} />
    </>
}

export default VideoSearch;