import { OrderTypeIds } from '../../models/order';
export default function getOrderTypes() {
    return Promise.resolve([
        {
            id: OrderTypeIds.LIMIT,
            translation: 'order.type.limit'
        },
        {
            id: OrderTypeIds.MARKET,
            translation: 'order.type.market'
        },
        {
            id: OrderTypeIds.STOP_LOSS,
            translation: 'order.type.stoploss'
        },
        {
            id: OrderTypeIds.STOP_LIMIT,
            translation: 'order.type.stoplimit'
        },
        {
            id: OrderTypeIds.LIMIT_HIT,
            translation: 'order.type.limithit'
        },
        {
            id: OrderTypeIds.TRAILING_STOP,
            translation: 'order.type.trailingstop'
        },
        {
            id: OrderTypeIds.JOIN,
            translation: 'order.type.join'
        },
        {
            id: OrderTypeIds.STANDARD_SIZE,
            translation: 'order.type.standardsize'
        },
        {
            id: OrderTypeIds.STANDARD_AMOUNT,
            translation: 'order.type.standardamount'
        },
        {
            id: OrderTypeIds.TAKE_PROFIT,
            translation: 'order.type.takeprofit'
        },
        {
            id: OrderTypeIds.COMBINED,
            translation: 'order.type.combined'
        },
        {
            id: OrderTypeIds.OCO,
            translation: 'order.type.oco'
        }
    ]);
}
//# sourceMappingURL=get-order-types.js.map