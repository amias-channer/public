import {Config} from 'frontend-core/dist/models/config';
import {ProductInfo} from 'frontend-core/dist/models/product';
import {NewsCategory, NewsCategoryIds, NewsSubCategory, NewsSubCategoryId} from '../../models/news';
import getNewsAvailableCategories from './get-news-available-categories';
import getNewsCategories from './get-news-categories';

const newsCategories: NewsCategory[] = getNewsCategories();

export default function getFilteredNewsCategoriesByProductIds(
    config: Config,
    params: ProductInfo['id'][]
): Promise<NewsCategory[]> {
    return getNewsAvailableCategories(config, params).then((newsSubCategoriesIds: NewsSubCategoryId[]) =>
        newsCategories.map((newsCategory: NewsCategory) => ({
            ...newsCategory,
            subCategories: newsCategory.subCategories.filter(
                ({id: subCategoryId}: NewsSubCategory) =>
                    newsSubCategoriesIds.includes(subCategoryId) || subCategoryId === NewsCategoryIds.ALL
            )
        }))
    );
}
