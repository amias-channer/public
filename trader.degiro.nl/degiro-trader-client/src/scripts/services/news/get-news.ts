import {Config} from 'frontend-core/dist/models/config';
import {ProductId, ProductInfo} from 'frontend-core/dist/models/product';
import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import getStocksByIsins from 'frontend-core/dist/services/products/stock/get-stocks-by-isins';
import isNonEmptyArray from 'frontend-core/dist/utils/collection/is-non-empty-array';
import {NewsArticle, NewsArticleResponse, NewsCategoryIds, NewsResponse, NewsTypes} from '../../models/news';
import addProductInfoToNewsArticles from './add-product-info-to-news-articles';
import getNewsArticlesIsins from './get-news-articles-isins';
import parseNewsArticleFromResponse from './parse-news-article-from-response';

export interface NewsRequestParams {
    isin?: string;
    languages?: string[];
    categoryId?: string;
    offset?: number;
    productIds?: ProductId[];
    shouldIncludeProductData?: boolean;
    limit: number;
    type: NewsTypes;
}

export default function getNews(config: Config, params: NewsRequestParams): Promise<NewsResponse> {
    // the backend expects "category" instead of "categoryId"
    const {categoryId, type: newsType, shouldIncludeProductData = false, productIds, ...queryParams} = {
        ...params,
        category: params.categoryId === NewsCategoryIds.ALL ? undefined : params.categoryId
    };

    return requestToApi({
        method: 'POST',
        config,
        url: `${config.refinitivNewsUrl}/${newsType}`,
        body: productIds,
        params: queryParams
    }).then((data: {offset: number; total: number; items?: NewsArticleResponse[]}) => {
        // TODO: remove when the backend serialization returns empty arrays correctly
        if (data.items === undefined) {
            return {...data, items: []};
        }

        const parsedData = {
            ...data,
            items: data.items.map((newsItems: NewsArticleResponse) => parseNewsArticleFromResponse(newsItems))
        };
        const parsedDataItems = parsedData.items;

        // TODO: remove if the sorting is implemented on the backend
        if (newsType === NewsTypes.TOP_NEWS) {
            parsedDataItems.sort((a: NewsArticle, b: NewsArticle) => b.date.valueOf() - a.date.valueOf());
        }

        const isins: string[] = getNewsArticlesIsins(parsedDataItems);

        return shouldIncludeProductData && isNonEmptyArray(isins)
            ? getStocksByIsins(config, isins).then((products: ProductInfo[]) => ({
                  ...parsedData,
                  items: addProductInfoToNewsArticles(parsedDataItems, products)
              }))
            : parsedData;
    });
}
