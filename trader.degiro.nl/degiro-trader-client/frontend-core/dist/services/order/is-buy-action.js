import { OrderActionIds, OrderActionIndices, OrderActionTypes } from '../../models/order';
export default function isBuyAction(paymentInfo) {
    const { buysell } = paymentInfo;
    return (buysell === OrderActionIds.BUY ||
        buysell === OrderActionTypes.BUY ||
        buysell === OrderActionTypes.BUY.toLowerCase() ||
        Number(buysell) === OrderActionIndices.BUY);
}
//# sourceMappingURL=is-buy-action.js.map