import { OrderTimeTypeIds, OrderTypeIds } from '../../models/order';
export default function getCurrencyOrderRequestData({ orderData }) {
    return {
        size: orderData.amount,
        productId: String(orderData.pairProduct.id),
        buySell: orderData.buySell,
        price: orderData.price,
        orderType: OrderTypeIds.LIMIT,
        timeType: OrderTimeTypeIds.DAY
    };
}
//# sourceMappingURL=get-currency-order-request-data.js.map