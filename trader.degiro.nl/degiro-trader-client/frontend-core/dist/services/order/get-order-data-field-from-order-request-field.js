import { orderDataFieldsByOrderRequestFields } from '../../models/order';
/**
 * @description Transform OrderRequestData field to OrderData field.
 *  NOTE: some fields may have the same name, as 'stopPrice', 'pegOffsetValue', etc.
 *  In this case we return initial field
 * @param {OrderType} orderType
 * @param {string} orderRequestField
 * @returns {string}
 */
export default function getOrderDataFieldFromOrderRequestField(orderType, orderRequestField) {
    const orderDataFields = orderDataFieldsByOrderRequestFields[orderType.id] || {};
    return orderDataFields[orderRequestField] || orderRequestField;
}
//# sourceMappingURL=get-order-data-field-from-order-request-field.js.map