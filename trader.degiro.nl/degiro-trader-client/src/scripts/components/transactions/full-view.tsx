import ExchangeAbbr from 'frontend-core/dist/components/ui-common/exchange-abbr';
import ItemDetailsIcon from 'frontend-core/dist/components/ui-trader4/icon/item-details-icon';
import {HistoricalTransaction} from 'frontend-core/dist/models/transaction';
import localize from 'frontend-core/dist/services/i18n/localize';
import isOrderBuyAction from 'frontend-core/dist/services/order/is-buy-action';
import getCurrencySymbol from 'frontend-core/dist/utils/currency/get-currency-symbol';
import * as React from 'react';
import {ProductInfo} from 'frontend-core/dist/models/product';
import {ConfigContext, I18nContext} from '../app-component/app-context';
import BuySellBadge from '../buy-sell-badge/index';
import {
    detailsIconCell,
    exchangeCell,
    inlineEndContentCell,
    row,
    secondaryContentCell as secondaryContent,
    selectableRow,
    stickyCellTableWrapper
} from '../table/table.css';
import {nbsp, valuePlaceholder} from '../value';
import Amount from '../value/amount';
import Price from '../value/price';
import getTransactionTypeLabel from './get-transaction-type-label';
import TradingVenue from './trading-venue';
import {tradingVenueCellFullContent} from './transactions.css';
import {TransactionsFiltersData} from './filters';
import Table from '../table';
import SortableColumn from '../data-table/sortable-column';
import useSorter from '../data-table/hooks/use-sorter';
import Column from '../table/column';
import ProductNameColumn from '../data-table/table-columns/product-name-column';
import {dataPlaceholder} from '../data-table/products-table/products-table.css';
import DateColumn from '../data-table/table-columns/date-column';

interface Props {
    transactions: HistoricalTransaction[] | undefined;
    filters: TransactionsFiltersData;
    onSort(orderBy: string): void;

    onItemSelect(transaction: HistoricalTransaction): void;
}

const {useContext, useCallback, memo} = React;
const TransactionsFullView = memo<Props>(({filters: {orderBy}, onSort, transactions, onItemSelect}) => {
    const config = useContext(ConfigContext);
    const i18n = useContext(I18nContext);
    const onItemClick = useCallback((transaction: HistoricalTransaction) => onItemSelect(transaction), []);
    const getRowClassName = useCallback(() => `${row} ${selectableRow}`, []);
    const getProductInfoFromTransaction = useCallback(
        ({productInfo}: HistoricalTransaction): ProductInfo | undefined => productInfo,
        []
    );
    const baseCurrencySymbolPrefix: string = `${getCurrencySymbol(config.baseCurrency)}${nbsp}`;
    const sorterByName = useSorter(onSort, orderBy, 'productInfo.name');
    const sorterByExchange = useSorter(onSort, orderBy, 'productInfo.exchange.hiqAbbr');
    const sorterByBuySell = useSorter(onSort, orderBy, 'buysell');
    const sorterByQuantity = useSorter(onSort, orderBy, 'quantity');
    const sorterByPrice = useSorter(onSort, orderBy, 'price');
    const sorterByTotal = useSorter(onSort, orderBy, 'total');
    const sorterByValue = useSorter(onSort, orderBy, 'totalInBaseCurrency');
    const sorterByFxRate = useSorter(onSort, orderBy, 'fxRate');
    const sorterByFee = useSorter(onSort, orderBy, 'feeInBaseCurrency');
    const sorterByTotalPlusFee = useSorter(onSort, orderBy, 'totalPlusFeeInBaseCurrency');

    return (
        <div className={stickyCellTableWrapper}>
            <Table data={transactions} onRowItemClick={onItemClick} getRowClassName={getRowClassName}>
                <ProductNameColumn<HistoricalTransaction>
                    {...sorterByName}
                    mapDataToProductInfo={getProductInfoFromTransaction}
                />
                <DateColumn<HistoricalTransaction>
                    {...useSorter(onSort, orderBy, 'date')}
                    dateClassName={secondaryContent}
                    format="DD/MM/YYYY HH:mm:ss"
                />
                <SortableColumn
                    {...sorterByExchange}
                    className={exchangeCell}
                    header={localize(i18n, 'trader.productDetails.exchange')}>
                    {({productInfo}) => productInfo?.exchange && <ExchangeAbbr exchange={productInfo.exchange} />}
                </SortableColumn>
                <Column header={localize(i18n, 'trader.productDetails.tradingVenue')}>
                    {({tradingVenue}) =>
                        tradingVenue && (
                            <TradingVenue value={tradingVenue} fullValueClassName={tradingVenueCellFullContent} />
                        )
                    }
                </Column>
                <SortableColumn
                    {...sorterByBuySell}
                    header={localize(i18n, 'trader.order.orderActionType')}
                    skeleton={<span className={dataPlaceholder}>{''.padEnd(8, nbsp)}</span>}>
                    {(transaction) => {
                        const transactionTypeLabel: string | undefined = getTransactionTypeLabel(i18n, transaction);

                        return (
                            <BuySellBadge isBuyAction={isOrderBuyAction(transaction)}>
                                {transactionTypeLabel && ` (${transactionTypeLabel})`}
                            </BuySellBadge>
                        );
                    }}
                </SortableColumn>
                <SortableColumn
                    {...sorterByQuantity}
                    header={localize(i18n, 'trader.productsTable.quantityColumn')}
                    className={inlineEndContentCell}>
                    {({quantity}) => quantity}
                </SortableColumn>
                <SortableColumn
                    {...sorterByPrice}
                    className={inlineEndContentCell}
                    header={localize(i18n, 'trader.productsTable.priceColumn')}>
                    {({id, productInfo, price}) => (
                        <Price
                            id={id}
                            prefix={productInfo && `${getCurrencySymbol(productInfo.currency)}${nbsp}`}
                            field="price"
                            value={price}
                        />
                    )}
                </SortableColumn>
                <SortableColumn
                    {...sorterByTotal}
                    className={inlineEndContentCell}
                    header={localize(i18n, 'trader.transactions.productCurrencyValue')}
                    skeleton={<span className={dataPlaceholder}>{''.padEnd(16, nbsp)}</span>}>
                    {({id, productInfo, total}) => (
                        <Amount
                            id={id}
                            prefix={productInfo && `${getCurrencySymbol(productInfo.currency)}${nbsp}`}
                            field="total"
                            marked={true}
                            value={total}
                        />
                    )}
                </SortableColumn>
                <SortableColumn
                    {...sorterByValue}
                    className={inlineEndContentCell}
                    header={localize(i18n, 'trader.transactions.baseCurrencyValue')}
                    skeleton={<span className={dataPlaceholder}>{''.padEnd(16, nbsp)}</span>}>
                    {({id, totalInBaseCurrency}) => {
                        return totalInBaseCurrency != null ? (
                            <Amount
                                id={id}
                                prefix={baseCurrencySymbolPrefix}
                                field="totalInBaseCurrency"
                                value={totalInBaseCurrency}
                            />
                        ) : (
                            valuePlaceholder
                        );
                    }}
                </SortableColumn>
                <SortableColumn
                    {...sorterByFxRate}
                    className={inlineEndContentCell}
                    header={localize(i18n, 'trader.productsTable.exchangeRate')}>
                    {({fxRate, id}) => (fxRate ? <Price id={id} field="fxRate" value={fxRate} /> : valuePlaceholder)}
                </SortableColumn>
                <SortableColumn
                    {...sorterByFee}
                    className={inlineEndContentCell}
                    header={localize(i18n, 'trader.transactions.feeColumn')}>
                    {({feeInBaseCurrency, id}) => {
                        return feeInBaseCurrency == null ? (
                            valuePlaceholder
                        ) : (
                            <Amount
                                id={id}
                                prefix={baseCurrencySymbolPrefix}
                                field="feeInBaseCurrency"
                                value={feeInBaseCurrency}
                            />
                        );
                    }}
                </SortableColumn>
                <SortableColumn
                    {...sorterByTotalPlusFee}
                    className={inlineEndContentCell}
                    header={localize(i18n, 'trader.transactions.totalValue')}>
                    {({totalPlusFeeInBaseCurrency, id}) => {
                        return totalPlusFeeInBaseCurrency != null ? (
                            <Amount
                                id={id}
                                prefix={baseCurrencySymbolPrefix}
                                field="totalPlusFeeInBaseCurrency"
                                value={totalPlusFeeInBaseCurrency}
                            />
                        ) : (
                            valuePlaceholder
                        );
                    }}
                </SortableColumn>
                <Column className={detailsIconCell} header={null}>
                    <ItemDetailsIcon />
                </Column>
            </Table>
        </div>
    );
});

TransactionsFullView.displayName = 'TransactionsFullView';
export default TransactionsFullView;
