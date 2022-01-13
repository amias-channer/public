import { OrderTimeTypeIds } from '../../models/order';
export default function getOrderTimeTypes() {
    return Promise.resolve([
        {
            id: OrderTimeTypeIds.DAY,
            translation: 'order.timeType.date'
        },
        {
            id: OrderTimeTypeIds.GTC,
            translation: 'order.timeType.gtc'
        }
    ]);
}
//# sourceMappingURL=get-order-time-types.js.map