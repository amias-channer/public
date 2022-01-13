import {Config} from 'frontend-core/dist/models/config';
import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {NewsArticleResponse, NewsResponse, NewsTypes} from '../../models/news';
import parseNewsArticleFromResponse from './parse-news-article-from-response';

export interface NewsRequestParams {
    isin?: string;
    languages: string[];
    offset?: number;
    limit: number;
}

export default function getNewsByCompany(config: Config, params: NewsRequestParams): Promise<NewsResponse> {
    return requestToApi({
        method: 'GET',
        config,
        url: `${config.refinitivNewsUrl}/${NewsTypes.NEWS_BY_COMPANY}`,
        params
    }).then(({items = [], ...data}: {offset: number; total: number; items?: NewsArticleResponse[]}) => ({
        ...data,
        items: items.map((newsItems: NewsArticleResponse) => parseNewsArticleFromResponse(newsItems))
    }));
}
