import type { ICategoryWithCreator } from "@/dto/ICategoryWithCreator";
import { BaseAuthenticatedService } from "./BaseAuthenticatedService";
import type { IdentityService } from "./IdentityService";
import { newLangString } from "@/dto/LangString";
import { EPlatform } from "@/dto/enums/EPlatform";

export class CategoryService extends BaseAuthenticatedService {
    constructor(identityService: IdentityService | null = null) {
        super("v1/categories/", identityService);
    }

    async listAllCategories(authorId: string | null): Promise<ICategoryWithCreator[]> {
        let query = "listAllCategories";
        if (authorId) {
            query += "?authorId=" + authorId;
        }
        const result = (await this.get<ICategoryWithCreator[]>(query)).data;
        for (const category of result) {
            category.name = newLangString(category.name)!;
        }
        return result;
    }

    async listAllCategoriesGroupByPlatform(authorId: string | null): Promise<Map<EPlatform, ICategoryWithCreator[]>> {
        const categories = await this.listAllCategories(authorId);
        const result = new Map<EPlatform, ICategoryWithCreator[]>();
        for (const category of categories) {
            if (!result.has(category.platform)) {
                result.set(category.platform, [] as ICategoryWithCreator[]);
            }
            result.get(category.platform)!.push(category);
        }
        return result;
    }
}