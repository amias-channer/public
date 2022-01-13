import {twoLineEllipsis} from 'frontend-core/dist/components/ui-trader4/text-utils.css';
import * as React from 'react';
import NewsArticleSubLabel from '../../news-article-sub-label';
import NewsArticleItem, {NewsArticleItemProps} from '../../news-article-item';
import NewsArticleTitle from '../../news-article-title';
import {selectedNewsListItem} from '../news-list.css';
import {latestNewsListItem, newsListItemTitle} from './latest-news-list-item.css';

interface Props extends NewsArticleItemProps {
    isSelected?: boolean;
}

const LatestNewsListItem: React.FunctionComponent<Props> = ({
    isSelected,
    className = '',
    newsArticle,
    'data-name': dataName
}) => (
    <NewsArticleItem
        data-name={dataName}
        newsArticle={newsArticle}
        className={`${latestNewsListItem} ${isSelected ? selectedNewsListItem : ''} ${className}`}>
        <NewsArticleTitle text={newsArticle.title} className={`${newsListItemTitle} ${twoLineEllipsis}`} />
        <NewsArticleSubLabel date={newsArticle.date} lastUpdated={newsArticle.lastUpdated} />
    </NewsArticleItem>
);

export default React.memo(LatestNewsListItem);
