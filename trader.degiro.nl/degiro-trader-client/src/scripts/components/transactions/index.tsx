import useDocumentTitle from 'frontend-core/dist/hooks/use-document-title';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {HistoricalTransaction} from 'frontend-core/dist/models/transaction';
import getAppSettingsGroup from 'frontend-core/dist/services/app-settings/get-app-settings-group';
import setAppSettingsGroup from 'frontend-core/dist/services/app-settings/set-app-settings-group';
import getFilterPeriod, {DateRange, FilterPeriodOptions} from 'frontend-core/dist/services/filter/get-filter-period';
import localize from 'frontend-core/dist/services/i18n/localize';
import getOrderTypes from 'frontend-core/dist/services/order/get-order-types';
import getTransactions from 'frontend-core/dist/services/transaction/get-transactions';
import keyBy from 'frontend-core/dist/utils/key-by';
import orderBy from 'frontend-core/dist/utils/order-by';
import * as React from 'react';
import useAsyncWithProgressiveState from 'frontend-core/dist/hooks/use-async-with-progressive-state';
import useAsync from 'frontend-core/dist/hooks/use-async';
import {Interval} from 'frontend-core/dist/models/interval';
import isNonEmptyArray from 'frontend-core/dist/utils/collection/is-non-empty-array';
import {loading} from 'frontend-core/dist/components/ui-trader4/visibility-utils.css';
import {TransactionsEvents} from '../../event-broker/event-types';
import {Unsubscribe, unsubscribeAll} from '../../event-broker/subscription';
import {OrderTypesMap} from '../../models/order';
import {Pagination} from '../../models/pagination';
import createSearchTextPattern from '../../services/filter/create-search-text-pattern';
import createPagination from '../../services/pagination/create-pagination';
import getProductName from '../../services/product/get-product-name';
import {
    AppApiContext,
    ConfigContext,
    CurrentClientContext,
    EventBrokerContext,
    I18nContext,
    MainClientContext
} from '../app-component/app-context';
import excludeOrderFieldFromFilters from '../data-table/exclude-order-field-from-filters';
import useDataTableFiltersSync from '../data-table/hooks/use-data-table-filters-sync';
import useDataTableFullLayoutFlag from '../data-table/hooks/use-data-table-full-layout-flag';
import {pageHeaderTitle} from '../page/page.css';
import {PortfolioDepreciationFiltersData} from '../portfolio-depreciation/filters';
import TransactionsCompactView from './compact-view';
import TransactionsFilters, {TransactionsFiltersData} from './filters';
import TransactionsFullView from './full-view';
import TransactionDetails from './transaction-details';
import Card from '../card';
import TableFooter from '../data-table/table-footer';
import getPagesInterval from '../../services/pagination/get-pages-interval';
import useNavigationThroughElementsByKeys from '../../hooks/use-navigation-through-elements-by-keys';
import {SearchHighlightContext} from '../search-highlight';
import useJumpFromOneSectionToAnotherByPressingKey from '../../hooks/use-jump-from-one-section-to-another-by-pressing-key';

const {useRef, useState, useMemo, useEffect, useContext, useReducer, useCallback, memo} = React;
const periodOptions: FilterPeriodOptions = {daysRange: 30};
const mapFromUrlFilters = (filters: Partial<PortfolioDepreciationFiltersData>) => {
    const period: DateRange = getFilterPeriod({value: filters.fromDate}, {value: filters.toDate}, periodOptions);

    return {
        // do not sync order field from URL
        ...excludeOrderFieldFromFilters(filters),
        fromDate: period.startDate,
        toDate: period.endDate
    };
};
const {fromDate, toDate} = mapFromUrlFilters({toDate: new Date()});
const Transactions = memo(() => {
    const app = useContext(AppApiContext);
    const eventBroker = useContext(EventBrokerContext);
    const config = useContext(ConfigContext);
    const currentClient = useContext(CurrentClientContext);
    const mainClient = useContext(MainClientContext);
    const i18n = useContext(I18nContext);
    const pageTitle: string = localize(i18n, 'trader.navigation.transactions');
    const [pagination, setPagination] = useState<Pagination>(createPagination);
    const [filters, setFilters] = useDataTableFiltersSync<TransactionsFiltersData>(
        {orderBy: '-date', fromDate, toDate, groupTransactionsByOrder: false},
        {mapFromUrlFilters}
    );
    const {value: orderTypesMap = {}, error: orderTypesError} = useAsync<OrderTypesMap>(
        async () => keyBy(await getOrderTypes()),
        []
    );
    const [updateCounts, forceUpdate] = useReducer((x: number) => x + 1, 0);
    const {isLoading, value: transactions, error} = useAsyncWithProgressiveState(
        () =>
            getTransactions(config, currentClient, {
                fromDate: filters.fromDate,
                toDate: filters.toDate,
                groupTransactionsByOrder: filters.groupTransactionsByOrder
            }),
        [config, currentClient, filters.fromDate, filters.toDate, filters.groupTransactionsByOrder, updateCounts]
    );

    useEffect(() => orderTypesError && logErrorLocally(orderTypesError), [orderTypesError]);
    useEffect(() => error && app.openModal({error}), [error]);
    useEffect(() => setPagination((pagination) => createPagination({...pagination, pageNumber: 0})), [
        transactions,
        filters.orderBy
    ]);

    const filteredPositions = useMemo<HistoricalTransaction[] | undefined>(() => {
        const {searchText} = filters;

        if (!transactions) {
            return;
        }

        let filteredTableItems: HistoricalTransaction[] = transactions;

        if (searchText) {
            const productMask: RegExp = createSearchTextPattern(searchText);

            filteredTableItems = transactions.filter(({id, productInfo}: HistoricalTransaction) => {
                return id === searchText || (productInfo && productMask.test(getProductName(mainClient, productInfo)));
            });
        }

        return orderBy<HistoricalTransaction>(filteredTableItems, filters.orderBy);
    }, [transactions, filters.orderBy, filters.searchText]);
    const hasFullView: boolean = useDataTableFullLayoutFlag();
    const sortItems = useCallback(
        (orderByValue: string) => setFilters((filters) => ({...filters, orderBy: orderByValue})),
        []
    );
    const onPaginationChange = useCallback(
        (pagination: Pagination) => {
            setPagination(({pageSize: currentPageSize}) => {
                const {pageSize: newPageSize} = pagination;

                if (hasFullView && newPageSize !== currentPageSize) {
                    setAppSettingsGroup(config, mainClient, {transactionsTableSize: newPageSize}).catch(
                        logErrorLocally
                    );
                }

                return pagination;
            });
        },
        [hasFullView, mainClient]
    );
    const showTransactionDetails = useCallback(
        (transaction: HistoricalTransaction) => {
            app.openSideInformationPanel({
                content: (
                    <TransactionDetails
                        orderTypesMap={orderTypesMap}
                        transaction={transaction}
                        onClose={app.closeSideInformationPanel}
                    />
                )
            });
        },
        [orderTypesMap, app]
    );

    useEffect(() => {
        setPagination((pagination) => {
            return createPagination({
                ...pagination,
                pageNumber: 0,
                pageSize: hasFullView ? getAppSettingsGroup(mainClient).transactionsTableSize : undefined
            });
        });
    }, [hasFullView]);

    useEffect(() => {
        setPagination((pagination) => {
            const filteredPositionsCount = filteredPositions?.length ?? 0;

            return createPagination({
                ...pagination,
                pageNumber: filteredPositionsCount > 0 ? pagination.pageNumber : 0,
                totalSize: filteredPositionsCount
            });
        });
    }, [filteredPositions]);

    useEffect(() => {
        const unsubscribeHandlers: Unsubscribe[] = [
            // Refresh the data
            eventBroker.on(TransactionsEvents.ADD, forceUpdate),
            eventBroker.on(TransactionsEvents.REMOVE, forceUpdate)
        ];

        return () => unsubscribeAll(unsubscribeHandlers);
    }, []);

    useDocumentTitle(pageTitle);

    const range: Interval<number> = getPagesInterval(pagination);
    // Keyboard navigation
    const filtersRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    useJumpFromOneSectionToAnotherByPressingKey(filtersRef, searchRef);
    useJumpFromOneSectionToAnotherByPressingKey(searchRef, filtersRef);

    useNavigationThroughElementsByKeys(searchRef);

    return (
        <Card
            data-name="transactions"
            innerHorizontalGap={false}
            header={
                <div ref={filtersRef}>
                    <h1 className={pageHeaderTitle}>{pageTitle}</h1>
                    <TransactionsFilters periodOptions={periodOptions} filters={filters} onSave={setFilters} />
                </div>
            }
            footer={
                hasFullView &&
                filteredPositions &&
                isNonEmptyArray(filteredPositions) && (
                    <TableFooter pagination={pagination} onPaginationChange={onPaginationChange} />
                )
            }>
            <SearchHighlightContext.Provider value={filters.searchText || ''}>
                <div aria-live="polite" ref={searchRef}>
                    {hasFullView && (
                        <div className={isLoading ? loading : undefined}>
                            <TransactionsFullView
                                transactions={filteredPositions?.slice(range.start, range.end)}
                                filters={filters}
                                onSort={sortItems}
                                onItemSelect={showTransactionDetails}
                            />
                        </div>
                    )}
                    {!hasFullView && (
                        <TransactionsCompactView
                            transactions={filteredPositions}
                            pagination={pagination}
                            orderTypesMap={orderTypesMap}
                            filters={filters}
                            sortItems={sortItems}
                            onPaginationChange={onPaginationChange}
                            onItemSelect={showTransactionDetails}
                        />
                    )}
                </div>
            </SearchHighlightContext.Provider>
        </Card>
    );
});

Transactions.displayName = 'Transactions';
export default Transactions;
