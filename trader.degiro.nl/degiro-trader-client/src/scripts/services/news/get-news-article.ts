import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {Config} from 'frontend-core/dist/models/config';
import getStocksByIsins from 'frontend-core/dist/services/products/stock/get-stocks-by-isins';
import {ProductInfo} from 'frontend-core/dist/models/product';
import {NewsArticle, NewsArticleResponse, NewsTypes} from '../../models/news';
import parseNewsArticleFromResponse from './parse-news-article-from-response';

export interface NewsArticleRequestParams {
    id: string;
    type: NewsTypes;
    categoryId?: string;
    isin?: string;
}

export default function getNewsArticle(config: Config, newsParams: NewsArticleRequestParams): Promise<NewsArticle> {
    const {categoryId, isin, id: newsArticleId} = newsParams;
    const newsArticlePath = categoryId ? `${categoryId}/${newsArticleId}` : newsArticleId;

    return Promise.all<NewsArticleResponse, ProductInfo[]>([
        requestToApi({
            config,
            url: `${config.refinitivNewsUrl}/${newsParams.type}/${newsArticlePath}`
        }),
        isin ? getStocksByIsins(config, [isin]) : []
    ]).then(([news, products]) => parseNewsArticleFromResponse(news, products));
}
