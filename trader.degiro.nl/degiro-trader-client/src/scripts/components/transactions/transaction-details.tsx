import {inlineRight} from 'frontend-core/dist/components/ui-trader4/alignment-utils.css';
import {selectableText} from 'frontend-core/dist/components/ui-trader4/selection-utils.css';
import {OrderType} from 'frontend-core/dist/models/order';
import {HistoricalTransaction} from 'frontend-core/dist/models/transaction';
import localize from 'frontend-core/dist/services/i18n/localize';
import isOrderBuyAction from 'frontend-core/dist/services/order/is-buy-action';
import getCurrencySymbol from 'frontend-core/dist/utils/currency/get-currency-symbol';
import * as React from 'react';
import {label, line, lineTopSeparator, valueItem} from '../../../styles/details-overview.css';
import {OrderTypesMap} from '../../models/order';
import {ConfigContext, CurrentClientContext, I18nContext} from '../app-component/app-context';
import PanelHeader from '../app-component/side-information-panel/header';
import PanelProductDetails from '../app-component/side-information-panel/product-details/index';
import {content, contentLayout} from '../app-component/side-information-panel/side-information-panel.css';
import BuySellBadge from '../buy-sell-badge/index';
import Hint from '../hint/index';
import {nbsp, valuePlaceholder} from '../value';
import Amount from '../value/amount';
import DateValue from '../value/date';
import Price from '../value/price';
import getTransactionTypeLabel from './get-transaction-type-label';
import TradingVenue from './trading-venue';

interface TransactionDetailsProps {
    transaction: HistoricalTransaction;
    orderTypesMap: OrderTypesMap;
    onClose(): void;
}

const {useContext} = React;
const TransactionDetails: React.FunctionComponent<TransactionDetailsProps> = ({
    transaction,
    onClose,
    orderTypesMap
}) => {
    const config = useContext(ConfigContext);
    const currentClient = useContext(CurrentClientContext);
    const i18n = useContext(I18nContext);
    const {id: transactionId, productInfo, orderTypeId, counterParty, tradingVenue} = transaction;
    const orderType: OrderType | undefined = orderTypeId ? orderTypesMap[orderTypeId] : undefined;
    const baseCurrencySymbolPrefix: string = `${getCurrencySymbol(config.baseCurrency)}${nbsp}`;
    const productCurrencySymbolPrefix: string | undefined =
        productInfo && `${getCurrencySymbol(productInfo.currency)}${nbsp}`;
    const transactionTypeLabel: string | undefined = getTransactionTypeLabel(i18n, transaction);

    return (
        <div data-name="transactionInformation" className={contentLayout}>
            <PanelHeader onAction={onClose}>{localize(i18n, 'trader.transactionDetails.title')}</PanelHeader>
            <div className={content}>
                {productInfo && <PanelProductDetails productInfo={productInfo} />}
                <div className={line}>
                    <div className={label}>{localize(i18n, 'trader.productsTable.dateColumn')}</div>
                    <DateValue
                        id={transactionId}
                        className={valueItem}
                        field="date"
                        format="DD/MM/YYYY HH:mm:ss"
                        value={transaction.date}
                    />
                </div>
                <div className={line}>
                    <div className={label}>{localize(i18n, 'trader.transactionDetails.transactionId')}</div>
                    <div className={`${valueItem} ${selectableText}`}>{transactionId}</div>
                </div>
                <div className={line}>
                    <div className={label}>{localize(i18n, 'trader.order.orderActionType')}</div>
                    <div className={valueItem}>
                        <BuySellBadge isBuyAction={isOrderBuyAction(transaction)}>
                            {transactionTypeLabel && ` (${transactionTypeLabel})`}
                        </BuySellBadge>
                    </div>
                </div>
                {orderType && (
                    <div className={line}>
                        <div className={label}>{localize(i18n, 'trader.orderForm.typeField')}</div>
                        <div className={valueItem}>{localize(i18n, orderType.translation)}</div>
                    </div>
                )}
                {tradingVenue && (
                    <div className={line}>
                        <div className={label}>{localize(i18n, 'trader.productDetails.tradingVenue')}</div>
                        <div className={valueItem}>
                            <TradingVenue value={tradingVenue} />
                        </div>
                    </div>
                )}
                <div className={line}>
                    <div className={label}>{localize(i18n, 'trader.productsTable.quantityColumn')}</div>
                    <div className={valueItem} data-field="quantity">
                        {transaction.quantity}
                    </div>
                </div>
                <div className={line}>
                    <div className={label}>{localize(i18n, 'trader.productsTable.priceColumn')}</div>
                    <Price
                        id={transactionId}
                        field="price"
                        className={valueItem}
                        prefix={productCurrencySymbolPrefix}
                        value={transaction.price}
                    />
                </div>
                <div className={line}>
                    <div className={label}>{localize(i18n, 'trader.transactions.productCurrencyValue')}</div>
                    <Amount
                        id={transactionId}
                        field="total"
                        className={valueItem}
                        prefix={productCurrencySymbolPrefix}
                        value={transaction.total}
                    />
                </div>
                <div className={line}>
                    <div className={label}>{localize(i18n, 'trader.transactions.baseCurrencyValue')}</div>
                    <Amount
                        id={transactionId}
                        field="totalInBaseCurrency"
                        className={valueItem}
                        prefix={baseCurrencySymbolPrefix}
                        value={transaction.totalInBaseCurrency}
                    />
                </div>
                <div className={line}>
                    <div className={label}>{localize(i18n, 'trader.productsTable.exchangeRate')}</div>
                    <Price id={transactionId} field="fxRate" className={valueItem} value={transaction.fxRate} />
                </div>
                <div className={line}>
                    <div className={label}>{localize(i18n, 'trader.transactions.feeColumn')}</div>
                    <Amount
                        id={transactionId}
                        field="feeInBaseCurrency"
                        className={valueItem}
                        prefix={baseCurrencySymbolPrefix}
                        value={transaction.feeInBaseCurrency}
                    />
                </div>
                <div className={line}>
                    <div className={label}>{localize(i18n, 'trader.transactions.totalValue')}</div>
                    <Amount
                        id={transactionId}
                        field="totalPlusFeeInBaseCurrency"
                        className={valueItem}
                        prefix={baseCurrencySymbolPrefix}
                        value={transaction.totalPlusFeeInBaseCurrency}
                    />
                </div>
                <div className={`${line} ${lineTopSeparator}`}>
                    <div className={label}>{localize(i18n, 'trader.transactions.counterParty')}</div>
                    <div className={valueItem}>
                        {counterParty ? `${counterParty} ` : valuePlaceholder}
                        {counterParty ? (
                            <Hint
                                className={inlineRight}
                                content={localize(i18n, 'trader.transactions.counterPartyDescription')}
                            />
                        ) : null}
                    </div>
                </div>
                <div className={line}>
                    <div className={label}>{localize(i18n, 'trader.transactions.reportingFirm')}</div>
                    <div className={valueItem} data-field="reportingFirm">
                        724500OYW3R4E1VAC404
                    </div>
                </div>
                <div className={line}>
                    <div className={label}>{localize(i18n, 'trader.transactions.username')}</div>
                    <div className={valueItem}>{currentClient.username}</div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(TransactionDetails);
