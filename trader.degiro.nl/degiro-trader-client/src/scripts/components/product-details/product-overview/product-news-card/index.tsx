import {inlineCenterContent} from 'frontend-core/dist/components/ui-trader4/alignment-utils.css';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {ProductInfo} from 'frontend-core/dist/models/product';
import localize from 'frontend-core/dist/services/i18n/localize';
import isEqualDate from 'frontend-core/dist/utils/date/is-equal-date';
import * as React from 'react';
import {Link, useParams} from 'react-router-dom';
import useAsyncWithProgressiveState from 'frontend-core/dist/hooks/use-async-with-progressive-state';
import isNonEmptyArray from 'frontend-core/dist/utils/collection/is-non-empty-array';
import InnerHtml from 'frontend-core/dist/components/ui-common/inner-html';
import {loading} from 'frontend-core/dist/components/ui-trader4/visibility-utils.css';
import {NewsArticle as NewsArticleModel, NewsResponse} from '../../../../models/news';
import {Pagination} from '../../../../models/pagination';
import {ProductSubLinks, Routes} from '../../../../navigation';
import createPagination from '../../../../services/pagination/create-pagination';
import setPageNumber from '../../../../services/pagination/set-page-number';
import {ConfigContext, CurrentClientContext, I18nContext} from '../../../app-component/app-context';
import PaginationButtons from '../../../pagination-buttons/index';
import Spinner from '../../../progress-bar/spinner';
import {
    articleWrapper,
    listBody,
    paginationPlaceholder,
    noNews,
    newsListItem,
    selectedNewsListItem,
    compactNewsListItemDate,
    newsListItemDate
} from './news-card.css';
import Grid from '../../../grid';
import Card from '../../../card';
import CardHeader from '../../../card/header';
import NewsArticle from './news-article';
import {item, primaryContent, primaryContentAsColumn, selectedItem} from '../../../list/list.css';
import DateValue from '../../../value/date';
import getNewsByCompany from '../../../../services/news/get-news-by-company';

interface Props {
    isin?: string;
    isFullView?: boolean;
    pagination?: Partial<Pagination>;
    productInfo?: ProductInfo;
}

const {useState, useEffect, useCallback, useContext, useMemo} = React;
const ProductNewsCard: React.FunctionComponent<Props> = ({
    productInfo,
    isin,
    isFullView = false,
    pagination: initialPagination = {pageSize: 10}
}) => {
    const config = useContext(ConfigContext);
    const i18n = useContext(I18nContext);
    const {language} = useContext(CurrentClientContext);
    const {productId} = useParams<{productId: string}>();
    const [selectedArticle, setSelectedArticle] = useState<NewsArticleModel | undefined>();
    const [pagination, setPagination] = useState<Pagination>(() => createPagination(initialPagination));
    const onPageNumberChange = useCallback((pageNumber: number) => {
        setPagination((pagination) => setPageNumber(pagination, pageNumber));
    }, []);
    const {error, isLoading, value: news} = useAsyncWithProgressiveState<NewsResponse>(() => {
        return getNewsByCompany(config, {
            isin,
            limit: pagination.pageSize,
            offset: pagination.pageNumber * pagination.pageSize,
            languages: language && language !== 'en' ? ['en', language] : ['en']
        });
    }, [isin, language, pagination.pageSize, pagination.pageNumber, productInfo?.id]);
    const articles = useMemo(() => news?.items ?? [], [news]);
    const isCompactDate: boolean = useMemo(() => articles.some(({date}) => !isEqualDate(date, new Date())), [articles]);
    const hasArticles: boolean = isNonEmptyArray(articles);

    useEffect(() => {
        if (news === undefined) {
            return;
        }
        const totalSize: number = news.total;

        setPagination((pagination) => {
            return createPagination({...pagination, totalSize, pagesCount: Math.ceil(totalSize / pagination.pageSize)});
        });
    }, [news?.total]);

    useEffect(() => {
        if (selectedArticle === undefined) {
            setSelectedArticle(articles[0]);
        }
    }, [articles, selectedArticle]);

    useEffect(() => error && logErrorLocally(error), [error]);

    return (
        <Card
            innerHorizontalGap={false}
            data-name="productNewsCard"
            header={<CardHeader title={localize(i18n, 'trader.markets.news.title')} />}
            footer={true}>
            {isLoading && news === undefined && <Spinner />}
            {hasArticles && (
                <Grid container={true}>
                    <Grid stretch={true} size={isFullView ? 6 : 12}>
                        <div className={`${listBody} ${isLoading ? loading : ''}`}>
                            {articles.map((article: NewsArticleModel) => {
                                const {id, date, title} = article;

                                return (
                                    <Link
                                        key={id}
                                        data-name="newsItem"
                                        to={`${Routes.PRODUCTS}/${productId}/${ProductSubLinks.NEWS}/${id}${
                                            isin ? `?isin=${isin}` : ''
                                        }`}
                                        className={`${item} ${newsListItem} ${
                                            isFullView && selectedArticle?.id === id
                                                ? `${selectedItem} ${selectedNewsListItem}`
                                                : ''
                                        }`}
                                        // eslint-disable-next-line react/jsx-no-bind
                                        onClick={
                                            isFullView
                                                ? (event) => {
                                                      event.preventDefault();
                                                      setSelectedArticle(article);
                                                  }
                                                : undefined
                                        }>
                                        {isFullView && (
                                            <DateValue
                                                id={id}
                                                field="date"
                                                value={date}
                                                onlyTodayTime={true}
                                                className={isCompactDate ? compactNewsListItemDate : newsListItemDate}
                                            />
                                        )}
                                        <span className={isFullView ? primaryContent : primaryContentAsColumn}>
                                            <InnerHtml>{title}</InnerHtml>
                                            {!isFullView && (
                                                <DateValue
                                                    id={id}
                                                    field="date"
                                                    value={date}
                                                    onlyTodayTime={true}
                                                    className={
                                                        isCompactDate ? compactNewsListItemDate : newsListItemDate
                                                    }
                                                />
                                            )}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                        <div className={paginationPlaceholder}>
                            <PaginationButtons
                                pagesCount={pagination.pagesCount}
                                pageNumber={pagination.pageNumber}
                                onChange={onPageNumberChange}
                            />
                        </div>
                    </Grid>
                    {isFullView && (
                        <Grid stretch={true} size={6}>
                            {selectedArticle && (
                                <div className={articleWrapper}>
                                    <NewsArticle
                                        id={selectedArticle.id}
                                        title={selectedArticle.title}
                                        date={selectedArticle.date}
                                        products={productInfo ? [productInfo] : []}
                                        content={selectedArticle.content}
                                        hasHtmlContent={selectedArticle.hasHtmlContent}
                                        isins={selectedArticle.isins}
                                    />
                                </div>
                            )}
                        </Grid>
                    )}
                </Grid>
            )}
            {!isLoading && !hasArticles && (
                <div data-name="noRelevantNews" className={`${inlineCenterContent} ${noNews}`}>
                    {localize(i18n, 'trader.productDetails.noRelevantNews')}
                </div>
            )}
        </Card>
    );
};

export default React.memo(ProductNewsCard);
