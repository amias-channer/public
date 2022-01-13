import * as React from 'react';
import NewsArticleImage from '../news-article-image';
import NewsArticleItem, {NewsArticleItemProps} from '../news-article-item';
import {dateTime, subCategoryLabelWrapper} from '../news-article-item/news-article-item.css';
import NewsArticleProductInfo from '../news-article-product-info';
import NewsArticleTitle from '../news-article-title';
import NewsSubCategoryLabel from '../news-sub-category-label';
import {content, focusNewsArticleItem, focusNewsPhoto, newsArticleDescription} from './focus-news-article-item.css';
import NewsArticleSubLabel from '../news-article-sub-label';

const FocusNewsArticleItem: React.FunctionComponent<NewsArticleItemProps> = ({
    newsArticle,
    className = '',
    'data-name': dataName
}) => {
    const {pictureUrl, brief, title, date, lastUpdated} = newsArticle;
    const [productInfo] = newsArticle.products;

    return (
        <NewsArticleItem
            data-name={dataName}
            newsArticle={newsArticle}
            className={`${focusNewsArticleItem} ${className}`}>
            {pictureUrl && (
                <NewsArticleImage src={pictureUrl} alt={title} className={focusNewsPhoto} width={268} height={202} />
            )}
            <div className={content}>
                {productInfo && <NewsArticleProductInfo productInfo={productInfo} />}
                <NewsArticleTitle text={title} />
                <div className={subCategoryLabelWrapper}>
                    <NewsSubCategoryLabel newsArticle={newsArticle} />
                    <NewsArticleSubLabel className={dateTime} date={date} lastUpdated={lastUpdated} />
                </div>
                {brief && <div className={newsArticleDescription}>{brief}</div>}
            </div>
        </NewsArticleItem>
    );
};

export default React.memo(FocusNewsArticleItem);
