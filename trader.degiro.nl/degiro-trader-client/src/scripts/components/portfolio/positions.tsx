import {inlineRight} from 'frontend-core/dist/components/ui-trader4/alignment-utils.css';
import useMediaQuery from 'frontend-core/dist/hooks/use-media-query';
import useToggle from 'frontend-core/dist/hooks/use-toggle';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {CashFundInfo as CashFundInfoModel} from 'frontend-core/dist/models/cash-fund';
import {Position} from 'frontend-core/dist/models/product';
import {ProductType, ProductTypeIds} from 'frontend-core/dist/models/product-type';
import getAppSettingsGroup from 'frontend-core/dist/services/app-settings/get-app-settings-group';
import setAppSettingsGroup from 'frontend-core/dist/services/app-settings/set-app-settings-group';
import getCashFundInfoFromPortfolio from 'frontend-core/dist/services/cash-fund/get-cash-fund-info-from-portfolio';
import localize from 'frontend-core/dist/services/i18n/localize';
import isFlatexCashFundPosition from 'frontend-core/dist/services/position/is-flatex-cash-fund-position';
import isJointCashPosition from 'frontend-core/dist/services/position/is-joint-cash-position';
import isProductCurrencyPosition from 'frontend-core/dist/services/position/is-product-currency-position';
import getCurrencySymbol from 'frontend-core/dist/utils/currency/get-currency-symbol';
import orderListBy from 'frontend-core/dist/utils/order-by';
import * as React from 'react';
import {Interval} from 'frontend-core/dist/models/interval';
import usePortfolioPositions from '../../hooks/use-portfolio-positions';
import useTotalPortfolio from '../../hooks/use-total-portfolio';
import {scrollableTable as tableViewMediaQuery} from '../../media-queries';
import {Pagination} from '../../models/pagination';
import createPagination from '../../services/pagination/create-pagination';
import getPagesInterval from '../../services/pagination/get-pages-interval';
import setTotalSize from '../../services/pagination/set-total-size';
import {
    AppApiContext,
    ConfigContext,
    CurrentClientContext,
    I18nContext,
    MainClientContext
} from '../app-component/app-context';
import Card from '../card';
import CardHeader from '../card/header';
import SidePanelCashFundInfo from '../cash-fund-info/side-panel';
import {isNonClickableArea} from '../clickable-area/non-clickable-area';
import TableFooter from '../data-table/table-footer';
import Hint from '../hint';
import {tableHeader, tableHeaderTitle} from '../table/table.css';
import {nbsp} from '../value';
import {PortfolioFiltersData} from './filters';
import {nonEmptyPositionsSection, positionsSection} from './portfolio.css';
import PositionDetails from './position-details';
import {PositionType, testPositionType} from './position-types';
import PositionsListHeader from './positions-list-header';
import PositionsListView from './positions-list-view';
import {PositionFields} from './positions-table-columns';
import PositionsTableView, {TableHeadCells} from './positions-table-view';

interface Props {
    productType: ProductType;
    positionType: PositionType;
}

export interface PositionsViewProps extends Props {
    filters: PortfolioFiltersData;
    positions: Position[];
    title: React.ReactNode;
    arePositionValuesSwitched: boolean;
    onPositionItemClick(position: Position, event: React.MouseEvent<HTMLElement>): void;
    onSort(orderByValue: string): void;
    onPositionValuesToggle(): void;
}

const {useState, useEffect, useCallback, useMemo, useContext} = React;
const Positions: React.FunctionComponent<Props> = React.memo(({productType, positionType}) => {
    const config = useContext(ConfigContext);
    const i18n = useContext(I18nContext);
    const mainClient = useContext(MainClientContext);
    const app = useContext(AppApiContext);
    const currentClient = useContext(CurrentClientContext);
    const productTypeId: ProductTypeIds = productType.id;
    const isCashProductType: boolean = productTypeId === ProductTypeIds.CASH;
    const localizeCashFundsCode = (translationCode: string) => localize(i18n, translationCode, {currency: ''});
    const baseCurrencySymbol: React.ReactNode = getCurrencySymbol(config.baseCurrency);
    const canStorePosition = (position: Position): boolean => {
        // inactive positions might not have `productInfo`
        if (!position.productInfo || !testPositionType(positionType, position)) {
            return false;
        }

        if (productTypeId === ProductTypeIds.CASH) {
            return isJointCashPosition(position) && !isProductCurrencyPosition(position, config.baseCurrency);
        }

        return true;
    };
    const [pagination, setPagination] = useState<Pagination>(createPagination);
    const [filters, setFilters] = useState<PortfolioFiltersData>({orderBy: '+productInfo.name'});
    const hasTableView = useMediaQuery(tableViewMediaQuery);
    const {totalPortfolio} = useTotalPortfolio();
    const {isLoading, positions} = usePortfolioPositions(productTypeId, canStorePosition);
    const positionsCount: number = positions.length;
    const positionValuesToggle = useToggle();
    const sortItems = useCallback((orderByValue: string) => {
        setFilters((filters) => ({...filters, orderBy: orderByValue}));
    }, []);
    const onPaginationChange = useCallback((pagination: Pagination) => {
        setPagination((currentPagination) => {
            const {pageSize} = pagination;

            if (currentPagination.pageSize !== pageSize) {
                setAppSettingsGroup(config, mainClient, {portfolioTableSize: pageSize}).catch(logErrorLocally);
            }

            return pagination;
        });
    }, []);
    const onNonCashPositionItemClick = useCallback(
        (position: Position, event: React.MouseEvent<HTMLElement>) => {
            if (isNonClickableArea(event)) {
                return;
            }

            app.openSideInformationPanel({
                content: <PositionDetails position={position} onClose={app.closeSideInformationPanel} />
            });
        },
        [i18n]
    );
    const onCashPositionItemClick = useCallback(
        (position: Position, event: React.MouseEvent<HTMLElement>) => {
            if (isNonClickableArea(event)) {
                return;
            }

            const cashFundInfo: CashFundInfoModel = getCashFundInfoFromPortfolio(
                config,
                currentClient,
                position,
                totalPortfolio
            );
            const isFlatexCashFund = isFlatexCashFundPosition(currentClient, position);

            app.openSideInformationPanel({
                content: (
                    <SidePanelCashFundInfo
                        cashFundInfo={cashFundInfo}
                        productInfo={position.productInfo}
                        onClose={app.closeSideInformationPanel}
                        title={
                            isFlatexCashFund
                                ? localize(i18n, 'trader.portfolio.flatexCashFunds.title')
                                : localize(i18n, 'trader.cashFunds.details.title')
                        }
                        cashFundPositionFields={
                            isFlatexCashFund ? ['freeCash', 'totalResult', 'totalLiquidity'] : undefined
                        }
                    />
                )
            });
        },
        [i18n, config, totalPortfolio]
    );
    const tableHeadCells: TableHeadCells = useMemo(
        () => ({
            [PositionFields.EXCHANGE]: localize(i18n, 'trader.productDetails.exchange'),
            [PositionFields.QUANTITY]: localize(i18n, 'trader.productsTable.quantityColumn'),
            [PositionFields.PRICE]: localize(i18n, 'trader.productsTable.priceColumn'),
            [PositionFields.CURRENCY]: localize(i18n, 'trader.productsTable.currencyColumn'),
            [PositionFields.ACCRUED_INTEREST]: localize(i18n, 'trader.portfolio.accruedInterestColumn'),
            [PositionFields.EXPOSURE]: localize(i18n, 'trader.portfolio.exposureColumn'),
            [PositionFields.TOTAL_VALUE]: localize(i18n, 'trader.productsTable.valueColumn'),
            [PositionFields.BREAK_EVEN_PRICE]: (
                <>
                    <span>{localize(i18n, 'trader.portfolio.breakEvenPriceColumn')}</span>
                    <Hint className={inlineRight} content={localize(i18n, 'trader.portfolio.breakEvenPriceHint')} />
                </>
            ),
            [PositionFields.TODAY_ABSOLUTE_DIFF]: (
                <>
                    {localize(i18n, 'trader.portfolio.absoluteDifference')}
                    {nbsp}
                    {baseCurrencySymbol}
                </>
            ),
            [PositionFields.TODAY_RELATIVE_DIFF]: localize(i18n, 'trader.portfolio.relativeDifference'),
            [PositionFields.CASH_FUND_TOTAL_VALUE]: (
                <>
                    <span>{localize(i18n, 'trader.cashFunds.totalValue')}</span>
                    <Hint className={inlineRight} content={localizeCashFundsCode('trader.cashFunds.totalValueHint')} />
                </>
            ),
            [PositionFields.CASH_FUND_TOTAL_VALUE_IN_BASE_CURRENCY]: (
                <>
                    {localize(i18n, 'trader.cashFunds.totalValue')}
                    {nbsp}
                    {baseCurrencySymbol}
                </>
            ),
            [PositionFields.CASH_FUND_TODAY_ABSOLUTE_DIFF]: (
                <>
                    {localize(i18n, 'trader.cashFunds.todayResult')}
                    {nbsp}
                    {baseCurrencySymbol}
                </>
            ),
            [PositionFields.CASH_FUND_TODAY_RELATIVE_DIFF]: (
                <>
                    <span>{localize(i18n, 'trader.cashFunds.todayResult')}</span> %
                    <Hint className={inlineRight} content={localizeCashFundsCode('trader.cashFunds.todayResultHint')} />
                </>
            ),
            [PositionFields.CASH_FUND_TOTAL_RESULT]: (
                <>
                    <span>{localize(i18n, 'trader.cashFunds.totalResult')}</span>
                    {nbsp}
                    {baseCurrencySymbol}
                    <Hint className={inlineRight} content={localizeCashFundsCode('trader.cashFunds.totalResultHint')} />
                </>
            ),
            [PositionFields.UNREALIZED_RELATIVE_PL]: (
                <>
                    <span>{localize(i18n, 'trader.portfolio.unrealizedPlColumn')}</span>
                    {nbsp}
                    {baseCurrencySymbol}
                    <Hint className={inlineRight} content={localize(i18n, 'trader.portfolio.unrealizedPlHint')} />
                </>
            ),
            [PositionFields.REALIZED_PL]: (
                <>
                    <span>{localize(i18n, 'trader.portfolio.realizedPlColumn')}</span>
                    {nbsp}
                    {baseCurrencySymbol}
                    <Hint className={inlineRight} content={localize(i18n, 'trader.portfolio.realizedPlHint')} />
                </>
            ),
            [PositionFields.TOTAL_RESULT]: (
                <>
                    <span>{localize(i18n, 'trader.portfolio.totalResultColumn')}</span>
                    {baseCurrencySymbol}
                    <Hint className={inlineRight} content={localize(i18n, 'trader.portfolio.totalResultHint')} />
                </>
            ),
            [PositionFields.LAST_UPDATE]: localize(i18n, 'trader.productDetails.lastUpdate'),
            productName: localize(i18n, 'trader.productsTable.productNameColumn')
        }),
        [i18n]
    );
    const flatexCashFundsTableHeadCells: TableHeadCells = useMemo(
        () => ({
            ...tableHeadCells,
            [PositionFields.CASH_FUND_TOTAL_VALUE]: (
                <>
                    <span>{localize(i18n, 'trader.flatexCashFunds.totalValue')}</span>
                    <Hint
                        className={inlineRight}
                        content={localizeCashFundsCode('trader.flatexCashFunds.totalValueHint')}
                    />
                </>
            ),
            [PositionFields.CASH_FUND_TOTAL_VALUE_IN_BASE_CURRENCY]: (
                <>
                    {localize(i18n, 'trader.flatexCashFunds.totalValue')}
                    {nbsp}
                    {baseCurrencySymbol}
                    {nbsp}
                </>
            ),
            [PositionFields.CASH_FUND_TODAY_RELATIVE_DIFF]: (
                <>
                    <span>{localize(i18n, 'trader.flatexCashFunds.todayResult')}</span> %
                    <Hint
                        className={inlineRight}
                        content={localizeCashFundsCode('trader.flatexCashFunds.todayResultHint')}
                    />
                </>
            )
        }),
        [i18n]
    );

    useEffect(() => setPagination((pagination) => setTotalSize(pagination, positionsCount)), [positionsCount]);

    useEffect(() => {
        if (hasTableView) {
            // reset the pagination
            setPagination((pagination) =>
                createPagination({
                    ...pagination,
                    pageNumber: 0,
                    totalSize: positionsCount,
                    pageSize: getAppSettingsGroup(mainClient).portfolioTableSize
                })
            );
        }
    }, [hasTableView, filters.orderBy]);

    if (isLoading) {
        return null;
    }

    if (!positionsCount) {
        return (
            <section
                data-name="positions"
                data-empty="true"
                data-product-type-id={productTypeId}
                className={positionsSection}
            />
        );
    }

    const flatexCashPositions: Position[] = positions.filter((position) =>
        isFlatexCashFundPosition(currentClient, position)
    );
    const render = (
        positions: Position[],
        title: React.ReactNode,
        hasTradingButtons: boolean,
        tableHeadCells: TableHeadCells
    ) => {
        const range: Interval<number> = getPagesInterval(pagination);
        const orderedPositions = orderListBy(positions, filters.orderBy);

        return (
            <div
                aria-live="polite"
                data-name="positions"
                data-empty="false"
                className={`${positionsSection} ${nonEmptyPositionsSection}`}>
                {hasTableView ? (
                    <Card
                        innerHorizontalGap={false}
                        header={
                            <h3 className={tableHeader}>
                                <span data-name="productType" className={tableHeaderTitle}>
                                    {title}
                                </span>
                            </h3>
                        }
                        footer={<TableFooter onPaginationChange={onPaginationChange} pagination={pagination} />}>
                        <PositionsTableView
                            productType={productType}
                            positionType={positionType}
                            filters={filters}
                            onSort={sortItems}
                            onPositionItemClick={
                                isCashProductType ? onCashPositionItemClick : onNonCashPositionItemClick
                            }
                            positions={orderedPositions.slice(range.start, range.end)}
                            tableHeadCells={tableHeadCells}
                            hasTradingButtons={hasTradingButtons}
                        />
                    </Card>
                ) : (
                    <Card
                        header={<CardHeader title={<span data-name="productType">{title}</span>} />}
                        innerHorizontalGap={false}>
                        {productTypeId !== ProductTypeIds.CASH && (
                            <PositionsListHeader
                                arePositionValuesSwitched={positionValuesToggle.isOpened}
                                onPositionValuesSwitch={positionValuesToggle.toggle}
                                positionTypeId={positionType.id}
                            />
                        )}
                        <PositionsListView
                            arePositionValuesSwitched={positionValuesToggle.isOpened}
                            onItemClick={isCashProductType ? onCashPositionItemClick : onNonCashPositionItemClick}
                            positions={orderedPositions}
                            positionTypeId={positionType.id}
                        />
                    </Card>
                )}
            </div>
        );
    };

    if (flatexCashPositions.length !== 0) {
        const nonFlatexCashPositions = positions.filter(
            (position) => !isFlatexCashFundPosition(currentClient, position)
        );

        return (
            <>
                {nonFlatexCashPositions.length !== 0 &&
                    render(nonFlatexCashPositions, localize(i18n, productType.translation), true, tableHeadCells)}
                {render(
                    flatexCashPositions,
                    localize(i18n, 'trader.portfolio.flatexCashFunds.title'),
                    false,
                    flatexCashFundsTableHeadCells
                )}
            </>
        );
    }

    return render(positions, localize(i18n, productType.translation), true, tableHeadCells);
});

Positions.displayName = 'Positions';
export default Positions;
