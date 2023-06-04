import { FormEvent } from "react";
import { IVideoSearchQuery } from "../../../dto/input/IVideoSearchQuery";
import { HandleChangeEventAction, UpdateStateAction } from "../../../utils/Utils";
import SelectListOptions from "../../SelectListOptions";
import { EVideoSortingOptions } from "../../../dto/enums/EVideoSortingOptions";
import CategoryPicker from "./CategoryPicker";

interface IProps {
    query: IVideoSearchQuery,
    handleChange: HandleChangeEventAction,
    updateCategoryIds: UpdateStateAction<string[]>
    onSubmit: () => Promise<void>,
}

const VideoSearchForm = (props: IProps) => {
    const onSubmit = async (e: Event | FormEvent) => {
        e.preventDefault();
        await props.onSubmit();
    }

    return (
        <form onSubmit={onSubmit}>
            <label htmlFor="nameQuery">Search video name:</label>
            <input type="text" id="nameQuery" name="nameQuery"
                value={props.query.nameQuery ?? ""}
                onChange={props.handleChange} />
            <label htmlFor="authorQuery">Search author name:</label>
            <input type="text" id="authorQuery" name="authorQuery"
                value={props.query.authorQuery ?? ""}
                onChange={props.handleChange}
            />
            <label htmlFor="sortingOptions">Sort by</label>
            <select id="sortingOptions" name="sortingOptions"
                value={props.query.sortingOptions}
                onChange={props.handleChange}>
                <SelectListOptions<EVideoSortingOptions>
                    values={Object.values(EVideoSortingOptions)} />
            </select>
            <label htmlFor="descending">Sort descending</label>
            <input type="checkbox" id="descending" name="descending"
                checked={props.query.descending}
                onChange={props.handleChange} />
            <CategoryPicker selectedCategoryIds={props.query.categoryIdsQuery}
                updateCategoryIds={props.updateCategoryIds} />
        </form>
    );
}

export default VideoSearchForm;