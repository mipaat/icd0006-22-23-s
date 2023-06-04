import { useContext, useEffect, useState } from "react";
import { UpdateStateAction } from "../../../utils/Utils";
import { EPlatform } from "../../../dto/enums/EPlatform";
import { ICategoryWithCreator } from "../../../dto/ICategoryWithCreator";
import { CategoryService } from "../../../services/CategoryService";
import { AuthContext } from "../../../routes/Root";
import CategoryPickerCategory from "./CategoryPickerCategory";

interface IProps {
    selectedCategoryIds: string[],
    updateCategoryIds: UpdateStateAction<string[]>,
}

const CategoryPicker = (props: IProps) => {
    const [categories, setCategories] = useState(null as Map<EPlatform, ICategoryWithCreator[]> | null);
    const authContext = useContext(AuthContext);

    useEffect(() => {
        const categoryService = new CategoryService(authContext);
        async function fetchCategories() {
            setCategories(await categoryService.listAllCategoriesGroupByPlatform(authContext.selectedAuthor?.id ?? null));
        }
        fetchCategories();
    }, [authContext]);

    const toggleCategorySelect = (category: ICategoryWithCreator): void => {
        props.updateCategoryIds(previous => {
            const index = previous.findIndex(i => i === category.id);
            const updatedCategoryIds = [...previous];
            if (index === -1) {
                updatedCategoryIds.push(category.id);
            } else {
                updatedCategoryIds.splice(index, 1);
            }
            return updatedCategoryIds;
        });
    }

    if (!categories) return <></>
    return <div>
        <button type="button" className="btn btn-primary"
            data-bs-toggle="collapse" data-bs-target="#category-collapse"
            aria-expanded="false" aria-controls="category-collapse">
            Category filter
        </button>
        <div className="collapse" id="category-collapse">
            {Array.from(categories.keys()).map(platform => {
                return (<div key={platform}>
                    <button type="button" className="btn btn-outline-dark"
                        data-bs-toggle="collapse" data-bs-target={`#category-${platform}-collapse`}
                        aria-expanded="false" aria-controls={`category-${platform}-collapse`}>
                        {platform}
                    </button>
                    <div className="collapse" id={`category-${platform}-collapse`}>
                        {categories.get(platform)!.map(category => {
                            return <CategoryPickerCategory
                                key={category.id}
                                category={category}
                                isSelected={props.selectedCategoryIds.includes(category.id)}
                                toggleCategorySelected={toggleCategorySelect} />
                        })}
                    </div>
                </div>);
            })}
        </div>
    </div>
}

export default CategoryPicker;