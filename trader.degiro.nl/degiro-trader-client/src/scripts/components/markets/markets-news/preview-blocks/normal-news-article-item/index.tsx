import * as React from 'react';
import NewsArticleSubLabel from '../news-article-sub-label';
import NewsArticleImage from '../news-article-image';
import NewsArticleItem, {NewsArticleItemProps} from '../news-article-item';
import {dateTime, subCategoryLabelWrapper} from '../news-article-item/news-article-item.css';
import NewsArticleProductInfo from '../news-article-product-info';
import NewsArticleTitle from '../news-article-title';
import NewsSubCategoryLabel from '../news-sub-category-label';
import {content, normalNewsArticleItem, normalNewsPhoto} from './normal-news-article-item.css';

const NormalNewsArticleItem: React.FunctionComponent<NewsArticleItemProps> = ({
    newsArticle,
    className = '',
    'data-name': dataName
}) => {
    const {pictureUrl, title, date, lastUpdated} = newsArticle;
    const [productInfo] = newsArticle.products;

    return (
        <NewsArticleItem
            data-name={dataName}
            newsArticle={newsArticle}
            className={`${normalNewsArticleItem} ${className}`}>
            {productInfo && <NewsArticleProductInfo productInfo={productInfo} />}
            <NewsArticleTitle text={title} />
            <div className={subCategoryLabelWrapper}>
                <NewsSubCategoryLabel newsArticle={newsArticle} />
                <NewsArticleSubLabel className={dateTime} date={date} lastUpdated={lastUpdated} />
            </div>
            <div className={content}>
                {pictureUrl && (
                    <NewsArticleImage
                        src={pictureUrl}
                        alt={title}
                        className={normalNewsPhoto}
                        width={100}
                        height={70}
                    />
                )}
                <div>{newsArticle.brief}</div>
            </div>
        </NewsArticleItem>
    );
};

export default React.memo(NormalNewsArticleItem);
