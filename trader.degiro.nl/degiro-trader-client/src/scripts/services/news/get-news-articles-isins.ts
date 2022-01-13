import {NewsArticle} from '../../models/news';

export default function getNewsArticlesIsins(newsItems: NewsArticle[]): string[] {
    return newsItems.map((newsItem: NewsArticle) => newsItem.isins?.[0]).filter(Boolean) as string[];
}
