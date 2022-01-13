import {NewsCategory, NewsSubCategory, NewsSubCategoryId} from '../../models/news';

export default function getNewsCategoryBySubCategoryId(
    newsCategories: NewsCategory[],
    subCategoryId: NewsSubCategoryId
): NewsCategory | undefined {
    return newsCategories.find(({subCategories}: NewsCategory) => {
        return subCategories?.find((subCategory: NewsSubCategory) => {
            return subCategory.id.toLowerCase() === subCategoryId.toLowerCase();
        });
    });
}
