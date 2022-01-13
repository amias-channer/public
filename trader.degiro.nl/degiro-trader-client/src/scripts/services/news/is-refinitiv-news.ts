import {NewsArticle} from '../../models/news';

export default function isRefinitivNews(newsArticle: NewsArticle): boolean {
    const {source = ''} = newsArticle;

    return source.toLowerCase().startsWith('refinitiv_');
}
