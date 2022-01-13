import { multiply } from '../../utils/decimal';
export default function getTotalOrderValue(orderData, productInfo) {
    let { totalOrderValue } = orderData;
    const { limit, number } = orderData;
    const { contractSize } = productInfo;
    if (totalOrderValue == null && limit != null && number != null && contractSize != null) {
        totalOrderValue = multiply(limit, number, contractSize);
    }
    return totalOrderValue;
}
//# sourceMappingURL=get-total-order-value.js.map