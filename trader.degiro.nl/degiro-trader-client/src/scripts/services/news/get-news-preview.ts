import {Config} from 'frontend-core/dist/models/config';
import {ProductId, ProductInfo} from 'frontend-core/dist/models/product';
import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import getStocksByIsins from 'frontend-core/dist/services/products/stock/get-stocks-by-isins';
import isNonEmptyArray from 'frontend-core/dist/utils/collection/is-non-empty-array';
import {NewsArticleResponse, NewsResponse} from '../../models/news';
import addProductInfoToNewsArticles from './add-product-info-to-news-articles';
import getNewsArticlesIsins from './get-news-articles-isins';
import getNewsCategories from './get-news-categories';
import getSubCategoryById from './get-news-sub-category-by-id';
import parseNewsArticleFromResponse from './parse-news-article-from-response';

export interface NewsRequestParams {
    productIds?: ProductId[];
}
export default function getNewsPreview(config: Config, params: NewsRequestParams): Promise<NewsResponse> {
    const newsCategories = getNewsCategories();

    return requestToApi({
        method: 'POST',
        config,
        body: params.productIds,
        url: `${config.refinitivNewsUrl}/top-news-preview`
    }).then((data: {offset: number; total: number; items: NewsArticleResponse[]}) => {
        // TODO: remove when the backend serialization returns empty arrays correctly
        if (data.items === undefined) {
            return {...data, items: []};
        }

        const parsedData = {
            ...data,
            items: data.items.map((newsArticleResponseItem: NewsArticleResponse) => {
                const {category} = newsArticleResponseItem;

                return {
                    ...parseNewsArticleFromResponse(newsArticleResponseItem),
                    subCategoryLabel: category && getSubCategoryById(newsCategories, category)?.label
                };
            })
        };
        const parsedDataItems = parsedData.items;
        const isins: string[] = getNewsArticlesIsins(parsedDataItems);

        return isNonEmptyArray(isins)
            ? getStocksByIsins(config, isins).then((products: ProductInfo[]) => ({
                  ...parsedData,
                  items: addProductInfoToNewsArticles(parsedDataItems, products)
              }))
            : parsedData;
    });
}
