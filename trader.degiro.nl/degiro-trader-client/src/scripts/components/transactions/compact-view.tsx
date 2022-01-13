import {inlineLeft} from 'frontend-core/dist/components/ui-trader4/alignment-utils.css';
import useScrollIntoView from 'frontend-core/dist/hooks/use-scroll-into-view';
import {HistoricalTransaction} from 'frontend-core/dist/models/transaction';
import localize from 'frontend-core/dist/services/i18n/localize';
import isOrderBuyAction from 'frontend-core/dist/services/order/is-buy-action';
import getCurrencySymbol from 'frontend-core/dist/utils/currency/get-currency-symbol';
import formatDate from 'frontend-core/dist/utils/date/format-date';
import parseDate from 'frontend-core/dist/utils/date/parse-date';
import * as React from 'react';
import isNonEmptyArray from 'frontend-core/dist/utils/collection/is-non-empty-array';
import {Interval} from 'frontend-core/dist/models/interval';
import {Pagination} from '../../models/pagination';
import getGroupingDate from '../../services/filter/get-grouping-date';
import getPagesInterval from '../../services/pagination/get-pages-interval';
import isPaginationChunkStartIndex from '../../services/pagination/is-pagination-chunk-start-index';
import setPageSize from '../../services/pagination/set-page-size';
import {ConfigContext, I18nContext} from '../app-component/app-context';
import BuySellBadge from '../buy-sell-badge/index';
import GroupedLists from '../list/grouped-lists';
import ListMoreButton from '../list/list-more-button';
import {
    item,
    primaryContentAsColumn,
    primaryContentTitle,
    secondaryContentAsColumn,
    secondaryContentTitle,
    subContent
} from '../list/list.css';
import ProductName from '../product-name/index';
import Amount from '../value/amount';
import DateValue from '../value/date';
import {nbsp} from '../value';
import NumericValue from '../value/numeric';
import Price from '../value/price';
import Spinner from '../progress-bar/spinner';
import NoProductsMessage from '../no-products-message';
import {noTableDataMessage} from '../table/table.css';
import {OrderTypesMap} from '../../models/order';
import {TransactionsFiltersData} from './filters';

interface Props {
    transactions: HistoricalTransaction[] | undefined;
    pagination: Pagination;
    orderTypesMap: OrderTypesMap;
    filters: TransactionsFiltersData;
    sortItems(orderBy: string): void;
    onPaginationChange(pagination: Pagination): void;
    onItemSelect(transaction: HistoricalTransaction): void;
}

const {useCallback, useRef, useContext, memo} = React;
const getGroupingValue = (transaction: HistoricalTransaction): string => getGroupingDate(transaction.date);
const renderListsDivider = (transaction: HistoricalTransaction) => {
    const parsedDate: Date | undefined = parseDate(transaction.date);

    return parsedDate && formatDate(parsedDate, 'YYYY-MM-DD');
};
const TransactionsCompactView = memo<Props>(({pagination, transactions, onPaginationChange, onItemSelect}) => {
    const config = useContext(ConfigContext);
    const i18n = useContext(I18nContext);
    const autoScrollItemRef = useRef<HTMLDivElement | null>(null);
    const renderListFooter = useCallback(() => {
        if (pagination.pagesCount > 1) {
            const loadMoreItems = () => {
                onPaginationChange(setPageSize(pagination, pagination.pageSize + pagination.pageSizeStep));
            };

            // eslint-disable-next-line react/jsx-no-bind
            return <ListMoreButton onClick={loadMoreItems} />;
        }
    }, [i18n, pagination, onPaginationChange]);
    const renderListItem = useCallback(
        (transaction: HistoricalTransaction, index: number) => {
            const {id: transactionId, productInfo, feeInBaseCurrency} = transaction;
            const baseCurrencySymbolPrefix: string = `${getCurrencySymbol(config.baseCurrency)}${nbsp}`;
            const productCurrencySymbolPrefix: string | undefined =
                productInfo && `${getCurrencySymbol(productInfo.currency)}${nbsp}`;
            const onItemClick = () => onItemSelect(transaction);

            return (
                <div
                    key={transactionId}
                    ref={isPaginationChunkStartIndex(index, pagination) ? autoScrollItemRef : null}
                    onClick={onItemClick}
                    className={item}
                    data-id={transactionId}
                    data-name="transaction">
                    <div className={primaryContentAsColumn}>
                        <div className={primaryContentTitle}>
                            <BuySellBadge
                                isBuyAction={isOrderBuyAction(transaction)}
                                shortFormat={true}
                                className={inlineLeft}
                            />
                            {productInfo && <ProductName productInfo={productInfo} />}
                        </div>
                        <div className={subContent}>
                            <DateValue id={transactionId} field="date" onlyTime={true} value={transaction.date} />{' '}
                            <NumericValue
                                value={transaction.quantity}
                                id={transactionId}
                                prefix={`${localize(i18n, 'trader.paymentDetails.quantityUnits')}${nbsp}`}
                                field="quantity"
                            />
                            {' @ '}
                            <Price
                                id={transactionId}
                                field="price"
                                prefix={productCurrencySymbolPrefix}
                                value={transaction.price}
                            />
                        </div>
                    </div>
                    <div className={secondaryContentAsColumn}>
                        <Amount
                            field="total"
                            id={transactionId}
                            className={secondaryContentTitle}
                            prefix={productCurrencySymbolPrefix}
                            value={transaction.total}
                        />
                        <div className={subContent}>
                            {feeInBaseCurrency ? (
                                <NumericValue
                                    id={transactionId}
                                    prefix={`${localize(
                                        i18n,
                                        'trader.transactions.feeColumn'
                                    )} ${baseCurrencySymbolPrefix}`}
                                    field="feeInBaseCurrency"
                                    value={feeInBaseCurrency}
                                />
                            ) : null}
                        </div>
                    </div>
                </div>
            );
        },
        [i18n, onItemSelect]
    );
    const range: Interval<number> = getPagesInterval(pagination);

    useScrollIntoView(autoScrollItemRef);

    if (!transactions) {
        return <Spinner />;
    }

    if (!isNonEmptyArray(transactions)) {
        return <NoProductsMessage className={noTableDataMessage} />;
    }

    return (
        <GroupedLists
            renderListItem={renderListItem}
            renderListFooter={renderListFooter}
            renderListsDivider={renderListsDivider}
            getGroupingValue={getGroupingValue}
            items={transactions.slice(range.start, range.end)}
        />
    );
});

TransactionsCompactView.displayName = 'TransactionsCompactView';
export default TransactionsCompactView;
