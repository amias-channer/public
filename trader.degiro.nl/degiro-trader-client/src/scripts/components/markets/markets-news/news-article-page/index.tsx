import {verticalScrollPanelShadowedWrapper} from 'frontend-core/dist/components/ui-trader4/scroll-panel/scroll-panel.css';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {AppError} from 'frontend-core/dist/models/app-error';
import {ProductInfo} from 'frontend-core/dist/models/product';
import localize from 'frontend-core/dist/services/i18n/localize';
import getStocksByIsins from 'frontend-core/dist/services/products/stock/get-stocks-by-isins';
import isNonEmptyArray from 'frontend-core/dist/utils/collection/is-non-empty-array';
import * as React from 'react';
import {useHistory} from 'react-router-dom';
import {
    availableNewsLanguages,
    NewsArticle,
    newsListId,
    NewsResponse,
    NewsSubCategoryId,
    NewsTypes
} from '../../../../models/news';
import getNews, {NewsRequestParams} from '../../../../services/news/get-news';
import getNewsArticle from '../../../../services/news/get-news-article';
import getNewsSettings from '../../../../services/news/get-news-settings';
import saveNewsSettings from '../../../../services/news/save-news-settings';
import {ConfigContext, CurrentClientContext, I18nContext} from '../../../app-component/app-context';
import CardHeader from '../../../card-obsolete/header';
import HeaderNavigationButton from '../../../header/compact-header/header-navigation-button';
import Spinner from '../../../progress-bar/spinner';
import {LayoutColumnsCount, NewsFiltersContext, NewsFiltersContextType} from '../../index';
import {MarketsNewsProps} from '../index';
import NewsList from '../news-list';
import NewsLanguageSelect from '../news-list/news-language-select';
import NewsArticleContent from './news-article-content';
import {
    articleCategoryTitle,
    errorMessage,
    fourColumnsLayout,
    fullHeight,
    fullWidth,
    fullWidthMainContent,
    mainContent,
    newsArticleContainer,
    newsList,
    oneColumnLayout,
    relatedStocksCard,
    scrollableContainer,
    threeColumnsLayout,
    twoColumnsLayout,
    compactHeader,
    newsListHeader
} from './news-article-page.css';
import RelatedStocks from './related-stocks';
import NoNewsMessage from '../no-news-message';
import useNewsFiltersProductIds from '../use-news-filters-product-ids';
import Header from './header';
import CompactHeader from '../compact-header';
import NewsFilterSelect from '../filters/news-filter-select';
import {valuesDelimiter} from '../../../value';

export interface NewsArticlePageProps extends MarketsNewsProps {
    className?: string;
    newsId: string;
    isLatestNews: boolean;
    layoutColumnsCount: LayoutColumnsCount;
}

const {useRef, useState, useEffect, useContext} = React;
const emptyNewsResponse: NewsResponse = {
    items: [],
    offset: 0,
    total: 0
};
const limit = 50;
const NewsArticlePage: React.FunctionComponent<NewsArticlePageProps> = ({
    subCategory,
    layoutColumnsCount,
    isLatestNews,
    newsId
}) => {
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const currentClient = useContext(CurrentClientContext);
    const history = useHistory();
    const scrollableContainerRef = useRef<HTMLDivElement | null>(null);
    const {filters} = useContext<NewsFiltersContextType>(NewsFiltersContext);
    const hasAppliedFilters: boolean = filters.favouritesListsIds.length > 0 || filters.hasPortfolio;
    const {productIds, isLoading: isNewsFiltersLoading} = useNewsFiltersProductIds(filters);
    const [isLoadingNewsList, setIsLoadingNewsList] = useState<boolean>(true);
    const [isLoadingSelectedArticle, setIsLoadingSelectedArticle] = useState<boolean>(true);
    const [selectedArticle, setSelectedArticle] = useState<NewsArticle | undefined>();
    const [news, setNews] = useState<NewsResponse>(emptyNewsResponse);
    const [prevSubCategoryId, setPrevSubCategoryId] = useState<NewsSubCategoryId | undefined>();
    const [defaultNewsLanguageCode] = useState<string>(() => getNewsSettings(currentClient).defaultLanguageCode);
    const [enabledNewsLanguageCodes, setEnabledNewsLanguageCodes] = useState<string[]>(
        () => getNewsSettings(currentClient).enabledLanguageCodes
    );
    const [relatedProducts, setRelatedProducts] = useState<ProductInfo[] | undefined>();
    const hasFullLayout: boolean = layoutColumnsCount > 2;
    const hasOneColumnLayout: boolean = layoutColumnsCount === 1;
    const subCategoryId: NewsSubCategoryId | undefined = subCategory?.id;
    const loadNews = (storedNews: NewsResponse, languages: string[]) => {
        if (isNewsFiltersLoading) {
            return;
        }

        const isTopNews: boolean = subCategory !== undefined;
        const params: NewsRequestParams = {
            offset: storedNews.items.length,
            limit,
            languages: isTopNews ? undefined : languages,
            shouldIncludeProductData: isTopNews,
            type: isTopNews ? NewsTypes.TOP_NEWS : NewsTypes.LATEST_NEWS,
            categoryId: subCategoryId,
            productIds
        };

        setIsLoadingNewsList(true);
        getNews(config, params)
            .then((news: NewsResponse) => {
                setIsLoadingNewsList(false);
                setNews({
                    ...news,
                    items: storedNews.items.concat(news.items)
                });
            })
            .catch(logErrorLocally);
    };
    const getProductsForNewsArticle = (newsArticle: NewsArticle): Promise<ProductInfo[]> => {
        const articleIsins: string[] = (newsArticle.isins || []).slice(0, 5);

        return isNonEmptyArray(articleIsins) ? getStocksByIsins(config, articleIsins) : Promise.resolve([]);
    };
    const selectArticle = (storedNews: NewsResponse, newsArticleId: string) => {
        const {items: newsItems} = storedNews;
        const hasNoNewsItems: boolean = newsItems.length === 0 && !isLoadingNewsList;
        const {current: scrollableContainer} = scrollableContainerRef;
        const storedNewsArticle: NewsArticle | undefined = newsItems[0];

        // [REFINITIV-2103] - while navigating to another sub category, article content is replaced by the first
        // news item content from the current sub category first
        if (prevSubCategoryId?.toLowerCase() !== subCategoryId?.toLowerCase()) {
            setIsLoadingSelectedArticle(true);
            return;
        }

        // it removes the article when there is no specific news id in the url
        if (hasNoNewsItems && newsArticleId === newsListId) {
            setSelectedArticle(undefined);
        }

        if ((hasNoNewsItems && newsArticleId === newsListId) || selectedArticle?.id === newsArticleId) {
            setIsLoadingSelectedArticle(false);
            return;
        }

        // [REFINITIV-2023] - when news are reseted after selecting sub category
        // isLoadingSelectedArticle should remains true otherwise it shows "no news" message
        if (isLoadingNewsList) {
            return;
        }

        setIsLoadingSelectedArticle(true);

        if (scrollableContainer) {
            requestAnimationFrame(() => (scrollableContainer.scrollTop = 0));
        }

        const newsType = isLatestNews ? NewsTypes.LATEST_NEWS : NewsTypes.TOP_NEWS;
        // Currently the list contains the complete article data, so check if the article isn't already there
        const nextSelectedArticle: NewsArticle | undefined =
            newsArticleId === newsListId
                ? storedNewsArticle
                : newsItems.find(({id}: NewsArticle) => id === newsArticleId);

        (nextSelectedArticle
            ? Promise.resolve(nextSelectedArticle)
            : getNewsArticle(config, {id: newsArticleId, type: newsType, categoryId: subCategoryId})
        )
            .then((article: NewsArticle) => {
                setRelatedProducts(undefined);
                getProductsForNewsArticle(article)
                    .then((products: ProductInfo[]) => {
                        setRelatedProducts(products);
                    })
                    .catch((error: Error) => {
                        setRelatedProducts(undefined);
                        logErrorLocally(error);
                    });
                setSelectedArticle(article);
            })
            .catch((error: Error | AppError) => {
                setRelatedProducts(undefined);
                setSelectedArticle(undefined);
                logErrorLocally(error);
            })
            .finally(() => setIsLoadingSelectedArticle(false));
    };
    const renderNewsArticleContent = () => {
        if (isLoadingSelectedArticle) {
            return <Spinner />;
        }

        if (selectedArticle) {
            return (
                <div className={`${verticalScrollPanelShadowedWrapper} ${fullHeight} ${fullWidth}`}>
                    <div className={scrollableContainer}>
                        <NewsArticleContent
                            newsArticle={selectedArticle}
                            relatedProducts={relatedProducts}
                            layoutColumnsCount={layoutColumnsCount}
                        />
                    </div>
                </div>
            );
        }

        return (
            <div className={errorMessage}>
                {news.items.length === 0 && hasAppliedFilters ? (
                    <NoNewsMessage />
                ) : (
                    localize(i18n, 'trader.markets.news.newsNoLongerAvailable')
                )}
            </div>
        );
    };
    const renderMultiColumnLayout = (title: string) => {
        const columnClassName: string = [oneColumnLayout, twoColumnsLayout, threeColumnsLayout, fourColumnsLayout][
            layoutColumnsCount - 1
        ];
        const loadMore = news.offset + limit < news.total ? () => loadNews(news, enabledNewsLanguageCodes) : undefined;
        const selectNewsLanguages = (enabledLanguageCodes: string[]) => {
            setEnabledNewsLanguageCodes(enabledLanguageCodes);
            saveNewsSettings({enabledLanguageCodes});
        };
        const {items: newsItems} = news;

        /* eslint-disable react/jsx-no-bind */
        return (
            <div data-name="newsArticlePage" className={`${columnClassName} ${newsArticleContainer}`}>
                {hasFullLayout && <Header subCategory={subCategory} />}
                {!hasFullLayout && !isLatestNews && (
                    <CompactHeader
                        hasOneColumnLayout={hasOneColumnLayout}
                        className={compactHeader}
                        subCategory={subCategory}
                        hasGreyBackground={false}
                        hasNewsListIdInLink={true}
                    />
                )}
                <div className={newsList}>
                    {isLatestNews ? (
                        <CardHeader title={title} className={newsListHeader}>
                            <NewsLanguageSelect
                                languages={availableNewsLanguages}
                                defaultLanguageCode={defaultNewsLanguageCode}
                                enabledLanguageCodes={enabledNewsLanguageCodes}
                                onChange={selectNewsLanguages}
                            />
                            {!hasFullLayout && <NewsFilterSelect />}
                        </CardHeader>
                    ) : (
                        <CardHeader
                            className={newsListHeader}
                            title={`${localize(i18n, 'trader.markets.news.topNews.title')}${valuesDelimiter}${title}`}
                        />
                    )}
                    {isNonEmptyArray(newsItems) ? (
                        <NewsList
                            isLatestNews={isLatestNews}
                            newsList={newsItems}
                            loadMore={loadMore}
                            selectedNewsArticleId={selectedArticle?.id}
                        />
                    ) : isLoadingNewsList ? null : (
                        <NoNewsMessage />
                    )}
                    {isLoadingNewsList && <Spinner />}
                </div>
                <div
                    className={`${mainContent} ${selectedArticle?.isins ? '' : fullWidthMainContent}`}
                    ref={scrollableContainerRef}>
                    {renderNewsArticleContent()}
                </div>
                {layoutColumnsCount === 4 && selectedArticle && selectedArticle.isins && (
                    <RelatedStocks className={relatedStocksCard} relatedProducts={relatedProducts} />
                )}
            </div>
        );
    };
    const renderOneColumnLayout = (title: string) => (
        <div className={fullWidth}>
            <HeaderNavigationButton onClick={history.goBack} />
            <div className={mainContent}>
                <CardHeader>
                    <h2 className={articleCategoryTitle}>{title}</h2>
                </CardHeader>
                {renderNewsArticleContent()}
            </div>
        </div>
    );

    useEffect(() => {
        setNews(emptyNewsResponse);
        loadNews(emptyNewsResponse, enabledNewsLanguageCodes);
    }, [subCategory, filters, isNewsFiltersLoading, enabledNewsLanguageCodes]);

    useEffect(() => {
        selectArticle(news, newsId);
        setPrevSubCategoryId(subCategoryId);
    }, [news, newsId, subCategory]);

    const title = subCategory?.label ?? localize(i18n, 'trader.markets.news.latestNews.title');

    return hasOneColumnLayout ? renderOneColumnLayout(title) : renderMultiColumnLayout(title);
};

export default React.memo(NewsArticlePage);
