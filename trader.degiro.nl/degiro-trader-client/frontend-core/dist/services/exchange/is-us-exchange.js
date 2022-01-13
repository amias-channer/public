// for complete list see Dictionary['exchanges'] in models/dictionary.ts
const usExchangeIds = new Set([
    '359',
    '362',
    '365',
    '367',
    '650',
    '663',
    '676',
    '688',
    '1003',
    '1004',
    '1005',
    '3001' // CNX, Currenex
]);
/**
 * @description Check if it's US exchanges
 * @param {string|number} exchangeId
 * @returns {boolean}
 */
export default function isUsExchange(exchangeId) {
    return usExchangeIds.has(String(exchangeId));
}
//# sourceMappingURL=is-us-exchange.js.map