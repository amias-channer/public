import {NewsCategory, NewsSubCategory, NewsSubCategoryId} from '../../models/news';

export default function getSubCategoryById(
    newsCategories: NewsCategory[],
    subCategoryId: NewsSubCategoryId
): NewsSubCategory | undefined {
    let subCategory: NewsSubCategory | undefined;

    newsCategories.some(({subCategories}: NewsCategory) => {
        subCategory = subCategories?.find((subCategory: NewsSubCategory) => subCategory.id === subCategoryId);

        return subCategory;
    });

    return subCategory;
}
