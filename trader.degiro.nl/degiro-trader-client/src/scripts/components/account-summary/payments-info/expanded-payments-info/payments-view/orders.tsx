import {inlineLeft} from 'frontend-core/dist/components/ui-trader4/alignment-utils.css';
import {Order, OrderTypeIds} from 'frontend-core/dist/models/order';
import localize from 'frontend-core/dist/services/i18n/localize';
import isOrderBuyAction from 'frontend-core/dist/services/order/is-buy-action';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {accentWhenSelectedLink} from '../../../../../../styles/link.css';
import getProductDetailsHref from '../../../../../services/router/get-product-details-href';
import {I18nContext} from '../../../../app-component/app-context';
import {selectableButtonWithBackdrop} from '../../../../button/button.css';
import BuySellBadge from '../../../../buy-sell-badge';
import getLimitFieldUnit from '../../../../order/common-order-form/fields/get-limit-field-unit';
import TrailingStopDistance from '../../../../order/common-order-form/fields/trailing-stop-distance';
import OrderDeleteButton from '../../../../order/order-delete-button';
import OrderEditButton from '../../../../order/order-edit-button';
import ProductInfoToggle from '../../../../product-info-toggle';
import ProductName from '../../../../product-name';
import {nbsp, valuePlaceholder} from '../../../../value';
import OrderInputPrice from '../../../../value/order-input-price';
import {
    cell,
    noDataMessage,
    priceCell,
    productCell,
    productCellContent,
    productInfoToggleCell,
    quantityCell,
    table as tableClassName
} from './payments-view.css';

const hiddenPriceOrderTypes: OrderTypeIds[] = [OrderTypeIds.STANDARD_SIZE, OrderTypeIds.STANDARD_AMOUNT];

interface Props {
    orders: Order[];
    showProductDetails?: boolean;
}

const {useContext} = React;
const Orders: React.FunctionComponent<Props> = ({showProductDetails, orders}) => {
    const i18n = useContext(I18nContext);

    if (!orders.length) {
        return <div className={noDataMessage}>{localize(i18n, 'trader.openOrders.noOrders')}</div>;
    }

    return (
        <table data-name="orders" className={tableClassName}>
            <tbody>
                {orders.map((order: Order) => {
                    const {productInfo, orderTypeId, joinMargin, id: orderId} = order;
                    const priceLeadingUnit: undefined | string =
                        productInfo && getLimitFieldUnit(productInfo, {onlyLeading: true});
                    const priceClosingUnit: undefined | string =
                        productInfo && getLimitFieldUnit(productInfo, {onlyClosing: true});
                    const isMarketOrder = orderTypeId === OrderTypeIds.MARKET;
                    const isStopLossOrder = orderTypeId === OrderTypeIds.STOP_LOSS;
                    const isStopLimitOrder = orderTypeId === OrderTypeIds.STOP_LIMIT;

                    return (
                        <tr key={orderId} data-name="openOrder">
                            <td className={cell}>
                                <OrderEditButton
                                    order={order}
                                    className={`${selectableButtonWithBackdrop} ${inlineLeft}`}
                                />
                                <OrderDeleteButton order={order} className={selectableButtonWithBackdrop} />
                            </td>
                            <td className={cell}>
                                <BuySellBadge isBuyAction={isOrderBuyAction(order)} shortFormat={true} />
                            </td>
                            <td className={quantityCell}>
                                <OrderInputPrice field="quantity" id={orderId} value={order.quantity || order.size} />
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
                                {isMarketOrder ? (
                                    localize(i18n, 'order.type.market')
                                ) : order.pegOffsetType != null ? (
                                    <TrailingStopDistance order={order} />
                                ) : joinMargin != null ? (
                                    <OrderInputPrice
                                        field="joinMargin"
                                        id={orderId}
                                        prefix={`BP${nbsp}`}
                                        value={joinMargin}
                                    />
                                ) : !hiddenPriceOrderTypes.includes(orderTypeId) ? (
                                    [
                                        priceLeadingUnit && `${priceLeadingUnit}${nbsp}`,
                                        <OrderInputPrice
                                            field={isStopLossOrder || isStopLimitOrder ? 'stopPrice' : 'price'}
                                            key="price"
                                            id={orderId}
                                            value={order[isStopLossOrder || isStopLimitOrder ? 'stopPrice' : 'price']}
                                        />,
                                        priceClosingUnit && `${nbsp}${priceClosingUnit}`
                                    ]
                                ) : null}
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

export default React.memo(Orders);
