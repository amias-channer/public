import useDocumentTitle from 'frontend-core/dist/hooks/use-document-title';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {AppError} from 'frontend-core/dist/models/app-error';
import {ProductsInfo} from 'frontend-core/dist/models/product';
import getAppSettingsGroup from 'frontend-core/dist/services/app-settings/get-app-settings-group';
import setAppSettingsGroup from 'frontend-core/dist/services/app-settings/set-app-settings-group';
import {SortTypes} from 'frontend-core/dist/services/filter';
import getFilterPeriod, {DateRange, FilterPeriodOptions} from 'frontend-core/dist/services/filter/get-filter-period';
import localize from 'frontend-core/dist/services/i18n/localize';
import getProductsInfo from 'frontend-core/dist/services/products/product/get-products-info';
import createCancellablePromise from 'frontend-core/dist/utils/async/create-cancellable-promise';
import * as React from 'react';
import {Pagination} from '../../models/pagination';
import {PriceAlert, PriceAlertsResult, PriceAlertsSortColumn} from '../../models/price-alert';
import createPagination from '../../services/pagination/create-pagination';
import setTotalSize from '../../services/pagination/set-total-size';
import getPriceAlerts from '../../services/price-alert/get-price-alerts';
import {
    AppApiContext,
    ConfigContext,
    CurrentClientContext,
    I18nContext,
    MainClientContext
} from '../app-component/app-context';
import excludeOrderFieldFromFilters from '../data-table/exclude-order-field-from-filters';
import useDataTableFiltersSync from '../data-table/hooks/use-data-table-filters-sync';
import useDataTableFullLayoutFlag from '../data-table/hooks/use-data-table-full-layout-flag';
import NoProductsMessage from '../no-products-message';
import {pageHeaderTitle} from '../page/page.css';
import Spinner from '../progress-bar/spinner';
import {noTableDataMessage} from '../table/table.css';
import PortfolioDepreciationCompactView from './compact-view/index';
import PortfolioDepreciationFilters, {PortfolioDepreciationFiltersData} from './filters';
import PortfolioDepreciationFullView from './full-view/index';
import Card from '../card';
import TableFooter from '../data-table/table-footer';

interface PriceAlertsData extends PriceAlertsResult {
    productsInfo: ProductsInfo;
}

const {useState, useEffect, useContext, useCallback, memo} = React;
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
const PortfolioDepreciation = memo(() => {
    const app = useContext(AppApiContext);
    const config = useContext(ConfigContext);
    const currentClient = useContext(CurrentClientContext);
    const mainClient = useContext(MainClientContext);
    const i18n = useContext(I18nContext);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [productsInfo, setProductsInfo] = useState<ProductsInfo>({});
    const [alerts, setAlerts] = useState<PriceAlert[]>([]);
    const [pagination, setPagination] = useState<Pagination>(createPagination);
    const [filters, setFilters] = useDataTableFiltersSync<PortfolioDepreciationFiltersData>(
        {orderBy: '-notificationDate', fromDate, toDate},
        {mapFromUrlFilters}
    );
    const hasFullView: boolean = useDataTableFullLayoutFlag();
    const pageTitle: string = localize(i18n, 'trader.navigation.portfolioDepreciation');
    const hasDataToRender: boolean = alerts[0] !== undefined;
    // sort items only on BE side
    const sortAlerts = useCallback(
        (orderByValue: string) => setFilters((filters) => ({...filters, orderBy: orderByValue})),
        [setFilters]
    );
    const onPaginationChange = useCallback(
        (pagination: Pagination) => {
            setPagination(({pageSize: currentPageSize}) => {
                const {pageSize: newPageSize} = pagination;

                if (hasFullView && newPageSize !== currentPageSize) {
                    setAppSettingsGroup(config, mainClient, {portfolioDepreciationTableSize: newPageSize}).catch(
                        logErrorLocally
                    );
                }

                return pagination;
            });
        },
        [hasFullView]
    );

    useEffect(() => {
        setPagination((pagination) => {
            return createPagination({
                ...pagination,
                pageNumber: 0,
                pageSize: hasFullView ? getAppSettingsGroup(mainClient).portfolioDepreciationTableSize : undefined
            });
        });
    }, [hasFullView, filters.orderBy]);

    useEffect(() => {
        const today: Date = new Date();
        const {orderBy, fromDate = today, toDate = today} = filters;
        const {pageNumber, pageSize} = pagination;
        const loadRequest = createCancellablePromise<PriceAlertsData>(
            getPriceAlerts(config, {
                requireTotal: true,
                fromDate,
                toDate,
                sortColumns: [orderBy.slice(1)] as PriceAlertsSortColumn[],
                sortTypes: [orderBy[0] === '+' ? SortTypes.ASC : SortTypes.DESC],
                offset: pageNumber * pageSize,
                limit: pageSize
            }).then((result: PriceAlertsResult) => {
                const productIds = new Set(result.rows.map((alert: PriceAlert) => alert.productId));

                return getProductsInfo(config, currentClient, {
                    productIds: [...productIds.values()]
                }).then((productsInfo: ProductsInfo) => ({...result, productsInfo}));
            })
        );

        setIsLoading(true);
        setAlerts([]);
        setProductsInfo({});

        loadRequest.promise
            .then(({rows, total = rows.length, productsInfo}: PriceAlertsData) => {
                setIsLoading(false);
                setAlerts(rows);
                setProductsInfo(productsInfo);
                setPagination((pagination) => setTotalSize(pagination, total));
            })
            .catch((error: Error | AppError) => {
                app.openModal({error});
                setIsLoading(false);
            });

        return loadRequest.cancel;
    }, [filters.orderBy, filters.fromDate, filters.toDate, pagination.pageNumber, pagination.pageSize]);

    useDocumentTitle(pageTitle);

    return (
        <Card
            data-name="portfolioDepreciation"
            innerHorizontalGap={false}
            header={
                <>
                    <h1 className={pageHeaderTitle}>{pageTitle}</h1>
                    <PortfolioDepreciationFilters periodOptions={periodOptions} filters={filters} onSave={setFilters} />
                </>
            }
            footer={
                !isLoading &&
                hasDataToRender &&
                hasFullView && <TableFooter pagination={pagination} onPaginationChange={onPaginationChange} />
            }>
            <div aria-live="polite">
                {isLoading && <Spinner />}
                {!isLoading && !hasDataToRender && <NoProductsMessage className={noTableDataMessage} />}
                {!isLoading && hasDataToRender && hasFullView && (
                    <PortfolioDepreciationFullView
                        filters={filters}
                        productsInfo={productsInfo}
                        alerts={alerts}
                        sortAlerts={sortAlerts}
                    />
                )}
                {!isLoading && hasDataToRender && !hasFullView && (
                    <PortfolioDepreciationCompactView
                        filters={filters}
                        pagination={pagination}
                        productsInfo={productsInfo}
                        alerts={alerts}
                        sortAlerts={sortAlerts}
                        onPaginationChange={onPaginationChange}
                    />
                )}
            </div>
        </Card>
    );
});

PortfolioDepreciation.displayName = 'PortfolioDepreciation';
export default PortfolioDepreciation;
