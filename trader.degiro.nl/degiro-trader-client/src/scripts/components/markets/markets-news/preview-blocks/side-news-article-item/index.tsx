import * as React from 'react';
import NewsArticleSubLabel from '../news-article-sub-label';
import NewsArticleImage from '../news-article-image';
import NewsArticleItem, {NewsArticleItemProps} from '../news-article-item';
import {dateTime, subCategoryLabelWrapper} from '../news-article-item/news-article-item.css';
import NewsArticleProductInfo from '../news-article-product-info';
import NewsArticleTitle from '../news-article-title';
import NewsSubCategoryLabel from '../news-sub-category-label';
import {
    sideNewsArticleBottomLineSeparator,
    sideNewsArticleItem,
    sideNewsArticlePhoto,
    wideSideNewsArticleItem
} from './side-news-article.css';

interface Props extends NewsArticleItemProps {
    hasBottomLineSeparator?: boolean;
    wide?: boolean;
}

const SideNewsArticleItem: React.FunctionComponent<Props> = ({
    newsArticle,
    className = '',
    hasBottomLineSeparator,
    wide,
    'data-name': dataName
}) => {
    const {pictureUrl, title, products, date, lastUpdated} = newsArticle;
    const [productInfo] = products;

    return (
        <NewsArticleItem
            data-name={dataName}
            newsArticle={newsArticle}
            className={`
                ${sideNewsArticleItem}
                ${className}
                ${hasBottomLineSeparator ? sideNewsArticleBottomLineSeparator : ''}
                ${wide ? wideSideNewsArticleItem : ''}
            `}>
            {pictureUrl && (
                <NewsArticleImage
                    src={pictureUrl}
                    alt={title}
                    className={sideNewsArticlePhoto}
                    // the biggest possible width among different layouts
                    width={600}
                    height={180}
                />
            )}
            {productInfo && <NewsArticleProductInfo productInfo={productInfo} />}
            <NewsArticleTitle text={title} />
            <div className={subCategoryLabelWrapper}>
                <NewsSubCategoryLabel newsArticle={newsArticle} />
                <NewsArticleSubLabel className={dateTime} date={date} lastUpdated={lastUpdated} />
            </div>
        </NewsArticleItem>
    );
};

export default React.memo(SideNewsArticleItem);
