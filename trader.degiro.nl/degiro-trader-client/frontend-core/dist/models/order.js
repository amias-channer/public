export var OrderActionIds;
(function (OrderActionIds) {
    OrderActionIds["BUY"] = "B";
    OrderActionIds["SELL"] = "S";
})(OrderActionIds || (OrderActionIds = {}));
export var OrderActionIndices;
(function (OrderActionIndices) {
    OrderActionIndices[OrderActionIndices["BUY"] = 0] = "BUY";
    OrderActionIndices[OrderActionIndices["SELL"] = 1] = "SELL";
})(OrderActionIndices || (OrderActionIndices = {}));
export var OrderActionTypes;
(function (OrderActionTypes) {
    OrderActionTypes["BUY"] = "BUY";
    OrderActionTypes["SELL"] = "SELL";
})(OrderActionTypes || (OrderActionTypes = {}));
export var OrderHistoryActionTypes;
(function (OrderHistoryActionTypes) {
    OrderHistoryActionTypes["CREATE"] = "CREATE";
    OrderHistoryActionTypes["DELETE"] = "DELETE";
    OrderHistoryActionTypes["MODIFY"] = "MODIFY";
})(OrderHistoryActionTypes || (OrderHistoryActionTypes = {}));
export var OrderHistoryActionStatuses;
(function (OrderHistoryActionStatuses) {
    OrderHistoryActionStatuses["CONFIRMED"] = "CONFIRMED";
    OrderHistoryActionStatuses["PENDING"] = "PENDING";
    OrderHistoryActionStatuses["REJECTED"] = "REJECTED";
})(OrderHistoryActionStatuses || (OrderHistoryActionStatuses = {}));
export var TrailingStopOrderOffsetTypes;
(function (TrailingStopOrderOffsetTypes) {
    TrailingStopOrderOffsetTypes[TrailingStopOrderOffsetTypes["PRICE"] = 0] = "PRICE";
    TrailingStopOrderOffsetTypes[TrailingStopOrderOffsetTypes["BASIS_POINT"] = 1] = "BASIS_POINT";
})(TrailingStopOrderOffsetTypes || (TrailingStopOrderOffsetTypes = {}));
export var OrderTypeIds;
(function (OrderTypeIds) {
    OrderTypeIds[OrderTypeIds["LIMIT"] = 0] = "LIMIT";
    OrderTypeIds[OrderTypeIds["STOP_LIMIT"] = 1] = "STOP_LIMIT";
    OrderTypeIds[OrderTypeIds["MARKET"] = 2] = "MARKET";
    OrderTypeIds[OrderTypeIds["STOP_LOSS"] = 3] = "STOP_LOSS";
    OrderTypeIds[OrderTypeIds["STANDARD_AMOUNT"] = 4] = "STANDARD_AMOUNT";
    OrderTypeIds[OrderTypeIds["STANDARD_SIZE"] = 5] = "STANDARD_SIZE";
    OrderTypeIds[OrderTypeIds["LIMIT_HIT"] = 10] = "LIMIT_HIT";
    OrderTypeIds[OrderTypeIds["JOIN"] = 12] = "JOIN";
    OrderTypeIds[OrderTypeIds["TRAILING_STOP"] = 13] = "TRAILING_STOP";
    OrderTypeIds[OrderTypeIds["TAKE_PROFIT"] = 14] = "TAKE_PROFIT";
    OrderTypeIds[OrderTypeIds["COMBINED"] = 15] = "COMBINED";
    OrderTypeIds[OrderTypeIds["OCO"] = 16] = "OCO";
})(OrderTypeIds || (OrderTypeIds = {}));
export var OrderTypeNames;
(function (OrderTypeNames) {
    OrderTypeNames["COMBINED"] = "COMBINED";
    OrderTypeNames["JOIN"] = "JOIN";
    OrderTypeNames["LIMIT"] = "LIMIT";
    OrderTypeNames["LIMIT_HIT"] = "LIMITHIT";
    OrderTypeNames["MARKET"] = "MARKET";
    OrderTypeNames["OCO"] = "OCO";
    OrderTypeNames["STANDARD_AMOUNT"] = "STANDARDAMOUNT";
    OrderTypeNames["STANDARD_SIZE"] = "STANDARDSIZE";
    OrderTypeNames["STOP_LIMIT"] = "STOPLIMIT";
    OrderTypeNames["STOP_LOSS"] = "STOPLOSS";
    OrderTypeNames["TAKE_PROFIT"] = "TAKEPROFIT";
    OrderTypeNames["TRAILING_STOP"] = "TRAILINGSTOP";
})(OrderTypeNames || (OrderTypeNames = {}));
export const orderTypeNamesById = {
    [OrderTypeIds.COMBINED]: OrderTypeNames.COMBINED,
    [OrderTypeIds.JOIN]: OrderTypeNames.JOIN,
    [OrderTypeIds.LIMIT]: OrderTypeNames.LIMIT,
    [OrderTypeIds.LIMIT_HIT]: OrderTypeNames.LIMIT_HIT,
    [OrderTypeIds.MARKET]: OrderTypeNames.MARKET,
    [OrderTypeIds.OCO]: OrderTypeNames.OCO,
    [OrderTypeIds.STANDARD_AMOUNT]: OrderTypeNames.STANDARD_AMOUNT,
    [OrderTypeIds.STANDARD_SIZE]: OrderTypeNames.STANDARD_SIZE,
    [OrderTypeIds.STOP_LIMIT]: OrderTypeNames.STOP_LIMIT,
    [OrderTypeIds.STOP_LOSS]: OrderTypeNames.STOP_LOSS,
    [OrderTypeIds.TAKE_PROFIT]: OrderTypeNames.TAKE_PROFIT,
    [OrderTypeIds.TRAILING_STOP]: OrderTypeNames.TRAILING_STOP
};
export var OrderTimeTypeIds;
(function (OrderTimeTypeIds) {
    OrderTimeTypeIds[OrderTimeTypeIds["DAY"] = 1] = "DAY";
    // Good 'Til Canceled
    OrderTimeTypeIds[OrderTimeTypeIds["GTC"] = 3] = "GTC";
    // Immediate or Cancel Order
    OrderTimeTypeIds[OrderTimeTypeIds["IOC"] = 0] = "IOC";
})(OrderTimeTypeIds || (OrderTimeTypeIds = {}));
export var OrderTimeTypeNames;
(function (OrderTimeTypeNames) {
    OrderTimeTypeNames["DAY"] = "DAY";
    OrderTimeTypeNames["GTC"] = "GTC";
    OrderTimeTypeNames["IOC"] = "IOC";
})(OrderTimeTypeNames || (OrderTimeTypeNames = {}));
export const orderTimeTypeNamesById = {
    [OrderTimeTypeIds.DAY]: OrderTimeTypeNames.DAY,
    [OrderTimeTypeIds.GTC]: OrderTimeTypeNames.GTC,
    [OrderTimeTypeIds.IOC]: OrderTimeTypeNames.IOC
};
export const orderDataRequiredFields = {
    [OrderTypeIds.JOIN]: ['joinMargin', 'number'],
    [OrderTypeIds.LIMIT]: ['number', 'limit'],
    [OrderTypeIds.LIMIT_HIT]: ['number', 'limit'],
    [OrderTypeIds.MARKET]: ['number'],
    [OrderTypeIds.STANDARD_AMOUNT]: ['amount'],
    [OrderTypeIds.STANDARD_SIZE]: ['number'],
    [OrderTypeIds.STOP_LOSS]: ['amount', 'number', 'stopPrice'],
    [OrderTypeIds.STOP_LIMIT]: ['number', 'limit', 'stopPrice'],
    [OrderTypeIds.TRAILING_STOP]: ['number', 'pegOffsetType', 'pegOffsetValue', 'stopPrice'],
    [OrderTypeIds.TAKE_PROFIT]: [],
    [OrderTypeIds.COMBINED]: [],
    [OrderTypeIds.OCO]: ['number', 'limit', 'stopPrice']
};
export const orderDataPositiveNumberFields = {
    [OrderTypeIds.JOIN]: ['number'],
    [OrderTypeIds.LIMIT]: ['amount', 'number', 'limit'],
    [OrderTypeIds.LIMIT_HIT]: ['amount', 'number', 'limit'],
    [OrderTypeIds.MARKET]: ['number'],
    [OrderTypeIds.STANDARD_AMOUNT]: ['amount'],
    [OrderTypeIds.STANDARD_SIZE]: ['number'],
    [OrderTypeIds.STOP_LOSS]: ['amount', 'number', 'stopPrice'],
    [OrderTypeIds.STOP_LIMIT]: ['amount', 'number', 'limit', 'stopPrice'],
    [OrderTypeIds.TRAILING_STOP]: ['number', 'stopPrice', 'pegOffsetValue'],
    [OrderTypeIds.TAKE_PROFIT]: [],
    [OrderTypeIds.COMBINED]: [],
    [OrderTypeIds.OCO]: ['number', 'limit', 'stopPrice']
};
export const orderRequestFieldsByOrderDataFields = {};
export const orderDataFieldsByOrderRequestFields = {
    [OrderTypeIds.LIMIT]: {
        price: 'limit',
        size: 'number'
    },
    [OrderTypeIds.LIMIT_HIT]: {
        price: 'limit',
        size: 'number'
    },
    [OrderTypeIds.STOP_LIMIT]: {
        size: 'number',
        price: 'limit'
    },
    [OrderTypeIds.STOP_LOSS]: {
        size: 'number'
    },
    [OrderTypeIds.TRAILING_STOP]: {
        size: 'number'
    },
    [OrderTypeIds.MARKET]: {
        size: 'number'
    },
    [OrderTypeIds.STANDARD_AMOUNT]: {
        size: 'amount'
    },
    [OrderTypeIds.STANDARD_SIZE]: {
        size: 'number'
    },
    [OrderTypeIds.JOIN]: {
        size: 'number'
    },
    [OrderTypeIds.TAKE_PROFIT]: {
        price: 'takePrice'
    },
    [OrderTypeIds.COMBINED]: {
        size: 'number',
        price: 'limit'
    },
    [OrderTypeIds.OCO]: {
        price: 'limit',
        size: 'number'
    }
};
// make an inversion
Object.keys(orderDataFieldsByOrderRequestFields).forEach((key) => {
    const orderTypeId = Number(key);
    const orderDataFields = orderDataFieldsByOrderRequestFields[orderTypeId];
    const orderRequestFields = {};
    Object.keys(orderDataFields).forEach((orderRequestField) => {
        const orderDataField = orderDataFields[orderRequestField];
        orderRequestFields[orderDataField] = orderRequestField;
    });
    orderRequestFieldsByOrderDataFields[orderTypeId] = orderRequestFields;
});
//# sourceMappingURL=order.js.map