import {twoLineEllipsis} from 'frontend-core/dist/components/ui-trader4/text-utils.css';
import * as React from 'react';
import NewsArticleImage from '../../news-article-image';
import NewsArticleItem, {NewsArticleItemProps} from '../../news-article-item';
import {subCategoryLabelWrapper} from '../../news-article-item/news-article-item.css';
import NewsArticleProductInfo from '../../news-article-product-info';
import NewsArticleTitle from '../../news-article-title';
import NewsSubCategoryLabel from '../../news-sub-category-label/index';
import {selectedNewsListItem} from '../news-list.css';
import {topNewsListItem, topNewsListItemPhoto, topNewsListItemTitle, wrapper} from './top-news-list-item.css';
import NewsArticleSubLabel from '../../news-article-sub-label';

interface Props extends NewsArticleItemProps {
    isSelected?: boolean;
}

const TopNewsListItem: React.FunctionComponent<Props> = ({
    isSelected,
    className = '',
    newsArticle,
    'data-name': dataName
}) => {
    const {pictureUrl, title, date, lastUpdated} = newsArticle;
    const [productInfo] = newsArticle.products;

    return (
        <NewsArticleItem
            data-name={dataName}
            newsArticle={newsArticle}
            className={`${topNewsListItem} ${isSelected ? selectedNewsListItem : ''} ${className}`}>
            {pictureUrl && (
                <NewsArticleImage
                    src={pictureUrl}
                    alt={title}
                    className={topNewsListItemPhoto}
                    width={76}
                    height={76}
                />
            )}
            <div className={wrapper}>
                {productInfo && <NewsArticleProductInfo productInfo={productInfo} />}
                <NewsArticleTitle text={title} className={`${topNewsListItemTitle} ${twoLineEllipsis}`} />
                <div className={subCategoryLabelWrapper}>
                    <NewsSubCategoryLabel newsArticle={newsArticle} />
                    <NewsArticleSubLabel date={date} lastUpdated={lastUpdated} />
                </div>
            </div>
        </NewsArticleItem>
    );
};

export default React.memo(TopNewsListItem);
