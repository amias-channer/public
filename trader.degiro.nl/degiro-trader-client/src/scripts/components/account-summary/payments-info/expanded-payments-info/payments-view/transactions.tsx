import {LatestTransaction} from 'frontend-core/dist/models/transaction';
import localize from 'frontend-core/dist/services/i18n/localize';
import isOrderBuyAction from 'frontend-core/dist/services/order/is-buy-action';
import getCurrencySymbol from 'frontend-core/dist/utils/currency/get-currency-symbol';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {accentWhenSelectedLink} from '../../../../../../styles/link.css';
import getProductDetailsHref from '../../../../../services/router/get-product-details-href';
import {I18nContext} from '../../../../app-component/app-context';
import BuySellBadge from '../../../../buy-sell-badge';
import ProductInfoToggle from '../../../../product-info-toggle';
import ProductName from '../../../../product-name';
import {nbsp, valuePlaceholder} from '../../../../value';
import DateValue from '../../../../value/date';
import OrderInputPrice from '../../../../value/order-input-price';
import Price from '../../../../value/price';
import {
    cell,
    dateCell,
    noDataMessage,
    priceCell,
    productCell,
    productCellContent,
    productInfoToggleCell,
    quantityCell,
    table as tableClassName
} from './payments-view.css';

interface Props {
    transactions: LatestTransaction[];
    showProductDetails?: boolean;
}

const {useContext} = React;
const Transactions: React.FunctionComponent<Props> = ({transactions, showProductDetails}) => {
    const i18n = useContext(I18nContext);

    if (!transactions.length) {
        return <div className={noDataMessage}>{localize(i18n, 'trader.transactions.noTransactions')}</div>;
    }

    return (
        <table className={tableClassName} data-name="transactions">
            <tbody>
                {transactions.map((transaction: LatestTransaction) => {
                    const {id: transactionId, productInfo} = transaction;

                    return (
                        <tr key={transactionId} data-name="transaction">
                            <td className={dateCell}>
                                <DateValue field="date" id={transactionId} onlyTime={true} value={transaction.date} />
                            </td>
                            <td className={cell}>
                                <BuySellBadge isBuyAction={isOrderBuyAction(transaction)} shortFormat={true} />
                            </td>
                            <td className={quantityCell}>
                                <OrderInputPrice field="quantity" id={transactionId} value={transaction.quantity} />
                            </td>
                            <td className={productCell}>
                                {productInfo ? (
                                    <Link
                                        to={getProductDetailsHref(productInfo.id)}
                                        className={`${accentWhenSelectedLink} ${productCellContent}`}>
                                        <ProductName productInfo={productInfo} />
                                    </Link>
                                ) : (
                                    valuePlaceholder
                                )}
                            </td>
                            <td className={priceCell}>
                                <Price
                                    field="price"
                                    id={transactionId}
                                    prefix={productInfo && `${getCurrencySymbol(productInfo.currency)}${nbsp}`}
                                    value={transaction.price}
                                />
                            </td>
                            {showProductDetails && (
                                <td className={productInfoToggleCell}>
                                    {productInfo && <ProductInfoToggle productInfo={productInfo} />}
                                </td>
                            )}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default React.memo(Transactions);
