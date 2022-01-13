import { orderRequestFieldsByOrderDataFields } from '../../models/order';
/**
 * @description Transform OrderRequestData field to OrderData field.
 *  NOTE: some fields may have the same name, as 'stopPrice', 'pegOffsetValue', etc.
 *  In this case we return initial field
 * @param {OrderType} orderType
 * @param {string} orderDataField
 * @returns {string}
 */
export default function getOrderRequestFieldFromOrderDataField(orderType, orderDataField) {
    const orderRequestFields = orderRequestFieldsByOrderDataFields[orderType.id] || {};
    return orderRequestFields[orderDataField] || orderDataField;
}
//# sourceMappingURL=get-order-request-field-from-order-data-field.js.map