import * as React from 'react';
import useAsyncWithProgressiveState from 'frontend-core/dist/hooks/use-async-with-progressive-state';
import {NewsArticle, NewsResponse, NewsTypes} from '../../../../models/news';
import getNews from '../../../../services/news/get-news';
import {ConfigContext} from '../../../app-component/app-context';
import Spinner from '../../../progress-bar/spinner';
import NewsList from '../news-list';
import {borderlessNewsList, fullHeight, spinnerLayout} from './latest-news.css';
import NoNewsMessage from '../no-news-message/index';
import useNewsFiltersProductIds from '../use-news-filters-product-ids';
import {NewsFiltersContext} from '../../index';

interface Props {
    enabledLanguageCodes: string[];
    limit?: number;
    hasFullHeight?: boolean;
}

const {useMemo, useContext} = React;
const LatestNewsFullView: React.FunctionComponent<Props> = ({enabledLanguageCodes, limit = 20, hasFullHeight}) => {
    const config = useContext(ConfigContext);
    const {filters} = useContext(NewsFiltersContext);
    const {productIds, isLoading: isNewsFiltersLoading} = useNewsFiltersProductIds(filters);
    const {value: newsResponse, isLoading} = useAsyncWithProgressiveState<NewsResponse | undefined>(() => {
        return isNewsFiltersLoading
            ? Promise.resolve(undefined)
            : getNews(config, {
                  offset: 0,
                  languages: enabledLanguageCodes,
                  limit,
                  type: NewsTypes.LATEST_NEWS,
                  productIds
              });
    }, [enabledLanguageCodes, limit, config, isNewsFiltersLoading, productIds]);
    const newsArticles = useMemo<NewsArticle[]>(() => newsResponse?.items ?? [], [newsResponse]);

    if (isLoading) {
        return <Spinner layoutClassName={spinnerLayout} />;
    }

    if (newsArticles.length === 0) {
        return <NoNewsMessage />;
    }

    return (
        <NewsList
            isLatestNews={true}
            newsList={newsArticles}
            className={`${borderlessNewsList} ${hasFullHeight ? fullHeight : ''}`}
        />
    );
};

export default React.memo(LatestNewsFullView);
