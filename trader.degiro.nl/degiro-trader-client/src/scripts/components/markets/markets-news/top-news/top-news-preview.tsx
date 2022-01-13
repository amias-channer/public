import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import localize from 'frontend-core/dist/services/i18n/localize';
import capitalize from 'frontend-core/dist/utils/string/capitalize';
import useAsyncWithProgressiveState from 'frontend-core/dist/hooks/use-async-with-progressive-state';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {actionLink} from '../../../../../styles/link.css';
import {NewsArticle, NewsResponse} from '../../../../models/news';
import {Routes} from '../../../../navigation';
import getNewsPreview from '../../../../services/news/get-news-preview';
import {ConfigContext, I18nContext} from '../../../app-component/app-context';
import CardHeader from '../../../card/header';
import Card from '../../../card';
import Spinner from '../../../progress-bar/spinner';
import FocusNewsArticleItem from '../preview-blocks/focus-news-article-item';
import TopNewsListItem from '../preview-blocks/news-list/top-news-list-item';
import NormalNewsArticleItem from '../preview-blocks/normal-news-article-item';
import SideNewsArticleItem from '../preview-blocks/side-news-article-item';
import {articleBlocksContainer, normalNewsList, noSideNews, seeMoreButton, topNewsFocusNews} from './top-news.css';
import NewsFilterSelect from '../filters/news-filter-select/index';
import useNewsFiltersProductIds from '../use-news-filters-product-ids';
import {NewsFiltersContext} from '../..';
import NoNewsMessage from '../no-news-message/index';

interface Props {
    hasCompactView: boolean;
}

const focusNewsCount: number = 1;
const {useMemo, useContext} = React;
const TopNewsPreview: React.FunctionComponent<Props> = ({hasCompactView}) => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const {filters} = useContext(NewsFiltersContext);
    const {productIds, isLoading: isNewsFiltersLoading} = useNewsFiltersProductIds(filters);
    const {value: newsResponse, isLoading} = useAsyncWithProgressiveState<NewsResponse | undefined>(() => {
        return isNewsFiltersLoading ? Promise.resolve(undefined) : getNewsPreview(config, {productIds});
    }, [config, productIds, isNewsFiltersLoading]);
    const newsItems = useMemo<NewsArticle[]>(() => newsResponse?.items ?? [], [newsResponse]);

    return (
        <Card
            innerHorizontalGap={!hasCompactView}
            data-name="topNews"
            header={
                <CardHeader title={localize(i18n, 'trader.markets.news.topNews.title')}>
                    <NewsFilterSelect />
                </CardHeader>
            }
            footer={
                <Link to={Routes.MARKETS_NEWS} className={`${actionLink} ${seeMoreButton}`}>
                    {capitalize(localize(i18n, 'trader.markets.news.goToNews'))}
                    <Icon type="keyboard_arrow_right" />
                </Link>
            }>
            <div className={`${articleBlocksContainer} ${noSideNews}`}>
                {isLoading && <Spinner />}
                {!isLoading && !newsItems.length && <NoNewsMessage />}
                {!isLoading && newsItems.length > 0 && (
                    <>
                        {!hasCompactView &&
                            newsItems
                                .slice(0, focusNewsCount)
                                .map((newsItem: NewsArticle) => (
                                    <FocusNewsArticleItem
                                        newsArticle={newsItem}
                                        key={newsItem.id}
                                        className={topNewsFocusNews}
                                    />
                                ))}
                        {!hasCompactView && (
                            <section className={normalNewsList}>
                                {newsItems.slice(focusNewsCount).map((newsItem: NewsArticle) => (
                                    <NormalNewsArticleItem newsArticle={newsItem} key={newsItem.id} />
                                ))}
                            </section>
                        )}
                        {hasCompactView && (
                            <section>
                                {newsItems.map((newsItem: NewsArticle, index: number) => {
                                    return index === 0 ? (
                                        <SideNewsArticleItem
                                            key={newsItem.id}
                                            newsArticle={newsItem}
                                            wide={true}
                                            hasBottomLineSeparator={true}
                                        />
                                    ) : (
                                        <TopNewsListItem newsArticle={newsItem} key={newsItem.id} />
                                    );
                                })}
                            </section>
                        )}
                    </>
                )}
            </div>
        </Card>
    );
};

export default React.memo(TopNewsPreview);
