import sanitize from 'frontend-core/dist/utils/sanitize';
import {ProductInfo} from 'frontend-core/dist/models/product';
import {NewsArticle, NewsArticleResponse} from '../../models/news';

export default function parseNewsArticleFromResponse(
    newsArticleResponse: NewsArticleResponse,
    products: ProductInfo[] = []
): NewsArticle {
    const {date, lastUpdated, htmlContent, title, pictureUrl, ...baseArticle} = newsArticleResponse;

    return {
        ...baseArticle,
        date: new Date(date),
        lastUpdated: lastUpdated ? new Date(lastUpdated) : undefined,
        hasHtmlContent: htmlContent,
        pictureUrl: pictureUrl?.replace('http://', 'https://'),
        // sanitize unescapes quotes (single, double), but not the &amp; -> &. So we still need the replace at the end
        title: sanitize(title)
            .replace(/&amp;/g, '&')
            .replace(/&apos;/g, "'"),
        products
    };
}
