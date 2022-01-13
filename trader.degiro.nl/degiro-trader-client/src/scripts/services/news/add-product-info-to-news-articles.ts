import {ProductInfo} from 'frontend-core/dist/models/product';
import {NewsArticle} from '../../models/news';

export default function addProductInfoToNewsArticles(newsItems: NewsArticle[], products: ProductInfo[]): NewsArticle[] {
    return newsItems.map((newsItem: NewsArticle) => {
        const {isins = []} = newsItem;
        const productsInfo: ProductInfo[] = products.filter(({isin}: ProductInfo) => isin && isins.includes(isin));

        return {...newsItem, products: productsInfo};
    });
}
