import {verticalScrollPanel} from 'frontend-core/dist/components/ui-trader4/scroll-panel/scroll-panel.css';
import * as React from 'react';
import {NewsArticle} from '../../../../models/news';
import LatestNewsListItem from '../preview-blocks/news-list/latest-news-list-item';
import TopNewsListItem from '../preview-blocks/news-list/top-news-list-item';

interface Props {
    newsList: NewsArticle[];
    className?: string;
    isLatestNews?: Boolean;
    selectedNewsArticleId?: string;
    loadMore?: () => void;
}

const {useCallback} = React;
const NewsList: React.FunctionComponent<Props> = ({
    isLatestNews,
    selectedNewsArticleId,
    newsList,
    className = '',
    loadMore
}) => {
    const loadMoreIfScrolledToBottom = useCallback(
        (event: React.UIEvent<HTMLDivElement>) => {
            const {currentTarget: newsListEl} = event;

            if (newsListEl && loadMore) {
                requestAnimationFrame(() => {
                    const {scrollHeight, scrollTop, clientHeight} = newsListEl;
                    const bottom: number = scrollHeight - scrollTop - clientHeight;
                    const loadMoreBottomOffsetThreshold = 20;

                    if (bottom < loadMoreBottomOffsetThreshold) {
                        loadMore();
                    }
                });
            }
        },
        [loadMore]
    );
    const ListItem: typeof LatestNewsListItem | typeof TopNewsListItem = isLatestNews
        ? LatestNewsListItem
        : TopNewsListItem;

    return (
        <div
            data-name="newsList"
            className={`${verticalScrollPanel} ${className}`}
            onScroll={loadMoreIfScrolledToBottom}>
            {newsList.map((newsItem: NewsArticle) => (
                <ListItem isSelected={newsItem.id === selectedNewsArticleId} newsArticle={newsItem} key={newsItem.id} />
            ))}
        </div>
    );
};

export default React.memo(NewsList);
