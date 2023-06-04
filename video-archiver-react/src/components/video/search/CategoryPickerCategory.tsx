import { ICategoryWithCreator } from "../../../dto/ICategoryWithCreator";
import { EPlatform } from "../../../dto/enums/EPlatform";
import LangStringDisplay from "../../LangStringDisplay";

interface IProps {
    category: ICategoryWithCreator,
    isSelected: boolean,
    toggleCategorySelected: (category: ICategoryWithCreator) => void,
}

const CategoryPickerCategory = (props: IProps) => {
    const isPublicArchiveCategory = (category: ICategoryWithCreator) =>
        category.isPublic && category.platform === EPlatform.This;

    const publicPrefix = (category: ICategoryWithCreator) =>
        isPublicArchiveCategory(category) ? "(Public) " : "";

    return <div>
        <label htmlFor={`category-${props.category.id}`}>
            {publicPrefix(props.category)}
            <LangStringDisplay langString={props.category.name} />
        </label>
        <input id={`category-${props.category.id}`} type="checkbox"
            checked={props.isSelected} onChange={e => props.toggleCategorySelected(props.category)} />
    </div>
};

export default CategoryPickerCategory;