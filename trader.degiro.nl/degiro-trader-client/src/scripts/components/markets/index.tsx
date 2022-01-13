import createLazyComponent from 'frontend-core/dist/components/ui-common/lazy-component/create-lazy-component';
import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import useDocumentTitle from 'frontend-core/dist/hooks/use-document-title';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {Redirect, Route, RouteComponentProps, Switch, useHistory, useLocation} from 'react-router-dom';
import useColumnsLayout, {ColumnsList} from '../../hooks/use-columns-layout';
import useGlobalFullLayoutFlag from '../../hooks/use-global-full-layout-flag';
import {MarketsNewsParams, NewsCategory, NewsCategoryIds, NewsSubCategory, NewsTypes} from '../../models/news';
import {Routes} from '../../navigation';
import getFiltersSettings from '../../services/news/get-filters-settings';
import getNewsCategories from '../../services/news/get-news-categories';
import getSubCategoryById from '../../services/news/get-news-sub-category-by-id';
import saveFiltersSettings from '../../services/news/save-filters-settings';
import isMarketsRootLinkActive from '../../services/router/is-markets-root-link-active';
import isNewsArticleLinkActive from '../../services/router/is-news-article-link-active';
import {I18nContext} from '../app-component/app-context';
import Alerts from '../inbox/alerts';
import {searchBadge} from '../input/search/search.css';
import Page from '../page';
import PageWrapper from '../page/page-wrapper';
import {lowPriorityStackingContext} from '../page/page.css';
import OpenedTasksAlert from '../profile/online-forms/opened-tasks-alert';
import {NewsFilters} from './markets-news/filters';
import {
    newsArticlePage,
    newsArticlePageContent,
    newsArticlePageObserverLayout,
    newsArticlePageWrapperMultiColumn,
    oneColumnLayout,
    page,
    pageInGlobalFullLayout,
    quickSearchButton,
    quickSearchButtonLayout,
    quickSearchButtonText,
    twoColumnsLayout
} from './markets.css';
import MarketsNavigation from './navigation';

export interface NewsFiltersContextType {
    filters: NewsFilters;
    onChange(updatedFilters: NewsFilters): void;
}

export const defaultNewsFilters: NewsFilters = {hasPortfolio: false, favouritesListsIds: []};
export const initialNewsFiltersContext: NewsFiltersContextType = {
    filters: defaultNewsFilters,
    onChange: () => defaultNewsFilters
};
export const NewsFiltersContext = React.createContext<NewsFiltersContextType>(initialNewsFiltersContext);
const MarketsAgenda = createLazyComponent(() => import(/* webpackChunkName: "markets-agenda" */ './agenda'));
const MarketsHome = createLazyComponent(() => import(/* webpackChunkName: "markets-home" */ './markets-home'));
const MarketsNews = createLazyComponent(() => import(/* webpackChunkName: "markets-news" */ './markets-news'));
const NewsArticleCard = createLazyComponent(
    () => import(/* webpackChunkName: "markets-news-article-card" */ './news/news-article-card')
);
const NewsArticlePage = createLazyComponent(
    () => import(/* webpackChunkName: "markets-news-article-page" */ './markets-news/news-article-page')
);
const NewsBreadcrumbs = createLazyComponent(
    () => import(/* webpackChunkName: "markets-news-breadcrumbs" */ './markets-news/news-breadcrumbs')
);
const NewsCategoriesCompactMenu = createLazyComponent(
    () =>
        import(
            /* webpackChunkName: "markets-news-categories-compact-menu" */ './markets-news/news-categories-menu/compact-menu'
        )
);

export type LayoutColumnsCount = 1 | 2 | 3 | 4;
const {useRef, useState, useContext, useMemo, useCallback} = React;
const columnsLayoutClassNames: [string, string] = [oneColumnLayout, twoColumnsLayout];
const columns: ColumnsList<LayoutColumnsCount> = [
    [1, {maxWidth: 735}],
    [2, {maxWidth: 1160}],
    [3, {maxWidth: 1470}],
    [4, {maxWidth: Infinity}]
];
const Markets: React.FunctionComponent = () => {
    const i18n = useContext(I18nContext);
    const location = useLocation();
    const history = useHistory();
    const hasGlobalFullLayout: boolean = useGlobalFullLayoutFlag();
    const [newsCategories] = useState<NewsCategory[]>(getNewsCategories);
    const columnsLayoutRef = useRef<HTMLDivElement | null>(null);
    const layoutColumnsCount: LayoutColumnsCount = useColumnsLayout<LayoutColumnsCount>(columnsLayoutRef, columns) || 2;
    const filtersSettings = useMemo<NewsFilters>(() => getFiltersSettings(), []);
    const [filters, setFilters] = useState<NewsFilters>(filtersSettings || defaultNewsFilters);
    const onChange = useCallback((filters: NewsFilters) => {
        saveFiltersSettings(filters);
        setFilters(filters);
    }, []);
    const newsFiltersContext = useMemo<NewsFiltersContextType>(() => ({filters, onChange}), [filters, onChange]);
    const columnLayoutClassName: string = columnsLayoutClassNames[layoutColumnsCount - 1] || '';
    const hasCompactLayout: boolean = layoutColumnsCount < 3;
    const pageClassName: string = `${lowPriorityStackingContext} ${page} ${
        // [TRADER-1771] TODO: remove `location` check when designs for markets subpages are ready
        hasGlobalFullLayout && !location.pathname.startsWith(Routes.MARKETS_AGENDA) ? pageInGlobalFullLayout : ''
    }`;
    const renderInPage = (children: React.ReactElement) => {
        let isRedirectedToProductsSearch: boolean = false;
        const isMarketsRootPage: boolean = isMarketsRootLinkActive(location);
        // [WF-2417] iPad doesn't fire Focus event for <button> tag, so we use Click handler as a fallback
        // Also we should handle double-click case
        const redirectToQuickSearch = () => {
            if (!isRedirectedToProductsSearch) {
                isRedirectedToProductsSearch = true;
                history.push(Routes.QUICK_SEARCH);
            }
        };

        return (
            <div className={columnLayoutClassName} ref={columnsLayoutRef}>
                <Page className={pageClassName}>
                    {!hasGlobalFullLayout && isMarketsRootPage && (
                        <div className={quickSearchButtonLayout}>
                            <button
                                type="button"
                                onFocus={redirectToQuickSearch}
                                onClick={redirectToQuickSearch}
                                className={quickSearchButton}>
                                <Icon type="search" className={searchBadge} />
                                <span className={quickSearchButtonText}>
                                    {localize(i18n, 'trader.productsSearch.searchFieldPlaceholder')}
                                </span>
                            </button>
                        </div>
                    )}
                    {children}
                </Page>
            </div>
        );
    };
    const pageWrapperClassName: string | undefined =
        isNewsArticleLinkActive(location) && layoutColumnsCount > 1 ? newsArticlePageWrapperMultiColumn : undefined;

    useDocumentTitle(localize(i18n, 'trader.navigation.markets'));

    return (
        <PageWrapper className={pageWrapperClassName}>
            <Switch>
                <Route
                    key="marketsNewsBreadCrumbs"
                    data-name="marketsNewsBreadCrumbs"
                    path={`${Routes.MARKETS_NEWS}/:subCategoryId/:id`}>
                    {() => (layoutColumnsCount > 1 ? <NewsBreadcrumbs /> : null)}
                </Route>
                <Route data-name="marketsNavigation" key="marketsNavigation" path={`${Routes.MARKETS}/(.*)?`}>
                    {(routeProps: RouteComponentProps<any>): React.ReactElement | null => {
                        if (routeProps.match.url !== Routes.MARKETS_NEWS_CATEGORIES) {
                            return <MarketsNavigation compact={hasGlobalFullLayout} />;
                        }

                        return null;
                    }}
                </Route>
            </Switch>
            <OpenedTasksAlert />
            <Alerts />
            <NewsFiltersContext.Provider value={newsFiltersContext}>
                <Switch>
                    <Route exact={true} path={Routes.MARKETS_NEWS}>
                        <Redirect to={`${Routes.MARKETS_NEWS}/${NewsCategoryIds.ALL}`} />
                    </Route>
                    {!hasGlobalFullLayout && (
                        <Route key="marketsNewsArticle" path={`${Routes.MARKETS_NEWS_ARTICLE}/:id`}>
                            {(): React.ReactElement => renderInPage(<NewsArticleCard />)}
                        </Route>
                    )}
                    <Route
                        key="marketsAgenda"
                        data-name="marketsAgenda"
                        exact={true}
                        path={`${Routes.MARKETS_AGENDA}/:agendaTypeId?/:agendaPeriodType?`}>
                        {(): React.ReactElement =>
                            renderInPage(<MarketsAgenda layoutColumnsCount={layoutColumnsCount} />)
                        }
                    </Route>
                    {hasCompactLayout && (
                        <Route
                            key="marketsNewsCompactMenu"
                            data-name="marketsNewsCompactMenu"
                            path={`${Routes.MARKETS_NEWS_CATEGORIES}/:subCategoryId/:id?`}>
                            {({
                                match
                            }: RouteComponentProps<{
                                subCategoryId: string;
                                id: string;
                            }>): React.ReactElement | null => {
                                const {id: newsListId, subCategoryId} = match.params;
                                const subCategory: NewsSubCategory | undefined = getSubCategoryById(
                                    newsCategories,
                                    subCategoryId
                                );

                                if (subCategory) {
                                    return (
                                        <div className={columnLayoutClassName} ref={columnsLayoutRef}>
                                            <NewsCategoriesCompactMenu
                                                layoutColumnsCount={layoutColumnsCount}
                                                subCategory={subCategory}
                                                newsListId={newsListId}
                                            />
                                        </div>
                                    );
                                }

                                return null;
                            }}
                        </Route>
                    )}
                    <Route key="marketNews" data-name="marketNews" path={`${Routes.MARKETS_NEWS}/:subCategoryId?/:id?`}>
                        {({match}: RouteComponentProps<MarketsNewsParams>): React.ReactElement => {
                            const {id: newsId, subCategoryId} = match.params;
                            const subCategory: NewsSubCategory | undefined = getSubCategoryById(
                                newsCategories,
                                subCategoryId || NewsCategoryIds.ALL
                            );

                            if (newsId) {
                                return (
                                    <div
                                        className={`${columnLayoutClassName} ${newsArticlePageObserverLayout}`}
                                        ref={columnsLayoutRef}>
                                        <Page
                                            className={`${newsArticlePage} ${pageClassName}`}
                                            contentClassName={newsArticlePageContent}>
                                            <NewsArticlePage
                                                subCategory={subCategory}
                                                isLatestNews={subCategoryId === NewsTypes.LATEST_NEWS}
                                                newsId={newsId}
                                                layoutColumnsCount={layoutColumnsCount}
                                            />
                                        </Page>
                                    </div>
                                );
                            }

                            return renderInPage(
                                <MarketsNews layoutColumnsCount={layoutColumnsCount} subCategory={subCategory} />
                            );
                        }}
                    </Route>
                    <Route key="marketsHome" path={Routes.MARKETS}>
                        {(): React.ReactElement => {
                            return renderInPage(<MarketsHome layoutColumnsCount={layoutColumnsCount} />);
                        }}
                    </Route>
                </Switch>
            </NewsFiltersContext.Provider>
        </PageWrapper>
    );
};

export default React.memo(Markets);
