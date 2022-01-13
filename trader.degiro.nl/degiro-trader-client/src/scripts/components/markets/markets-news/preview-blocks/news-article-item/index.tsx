import * as React from 'react';
import {Link, useParams} from 'react-router-dom';
import {accentWhenSelectedLink} from '../../../../../../styles/link.css';
import {MarketsNewsParams, NewsArticle, NewsCategoryIds} from '../../../../../models/news';
import {Routes} from '../../../../../navigation';

export interface NewsArticleItemProps {
    newsArticle: NewsArticle;
    className?: string;
    'data-name'?: string;
}

const NewsArticleItem: React.FunctionComponent<NewsArticleItemProps> = ({
    newsArticle,
    children,
    className = '',
    'data-name': dataName
}) => {
    const {subCategoryId} = useParams<MarketsNewsParams>();
    const {category, id} = newsArticle;
    const url = category
        ? `${Routes.MARKETS_NEWS}/${subCategoryId === NewsCategoryIds.ALL ? subCategoryId : category}/${id}`
        : `${Routes.MARKETS_NEWS_LATEST_NEWS}/${id}`;

    return (
        <Link data-name={dataName} to={url} className={`${accentWhenSelectedLink} ${className}`}>
            {children}
        </Link>
    );
};

export default React.memo<React.PropsWithChildren<NewsArticleItemProps>>(NewsArticleItem);
