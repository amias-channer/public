import { OrderActionTypes, OrderTypeIds } from '../../models/order';
import parseNumber from '../../utils/number/parse-number';
import getOrderDataFieldFromOrderRequestField from './get-order-data-field-from-order-request-field';
export default function getOrderRequestData(params) {
    const { isBuyAction, orderType, orderTimeType, productInfo, orderData } = params;
    const result = {
        buySell: isBuyAction ? OrderActionTypes.BUY : OrderActionTypes.SELL,
        orderType: orderType.id,
        productId: productInfo.id,
        timeType: orderTimeType === null || orderTimeType === void 0 ? void 0 : orderTimeType.id
    };
    if (orderData.combinedStopPrice !== undefined) {
        result.combinedStopPrice = parseNumber(String(orderData.combinedStopPrice));
    }
    if (orderData.combinedTakePrice !== undefined) {
        result.combinedTakePrice = parseNumber(String(orderData.combinedTakePrice));
    }
    let orderRequestFields = [];
    switch (orderType.id) {
        case OrderTypeIds.LIMIT:
        case OrderTypeIds.LIMIT_HIT:
            orderRequestFields = ['size', 'price'];
            break;
        case OrderTypeIds.STOP_LIMIT:
            orderRequestFields = ['size', 'price', 'stopPrice'];
            break;
        case OrderTypeIds.STOP_LOSS:
            orderRequestFields = ['size', 'stopPrice'];
            break;
        case OrderTypeIds.TRAILING_STOP:
            orderRequestFields = ['size', 'stopPrice', 'pegOffsetValue'];
            result.pegOffsetType = orderData.pegOffsetType;
            break;
        case OrderTypeIds.MARKET:
        case OrderTypeIds.STANDARD_AMOUNT:
        case OrderTypeIds.STANDARD_SIZE:
            orderRequestFields = ['size'];
            break;
        case OrderTypeIds.JOIN:
            orderRequestFields = ['size', 'joinMargin'];
            break;
        case OrderTypeIds.OCO:
            orderRequestFields = ['size', 'price', 'stopPrice'];
            break;
        default:
        //
    }
    orderRequestFields.forEach((orderRequestField) => {
        const orderDataField = getOrderDataFieldFromOrderRequestField(orderType, orderRequestField);
        result[orderRequestField] = parseNumber(String(orderData[orderDataField]));
    });
    return result;
}
//# sourceMappingURL=get-order-request-data.js.map