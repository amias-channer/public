const symbols = {
    EUR: '€',
    USD: '$',
    GBP: '£',
    JPY: '¥',
    CZK: 'Kč',
    PLN: 'zł'
};
/**
 * @see {@link http://confluence/display/WF/Parsing+and+formatting+data}
 * @param {string|undefined} currencyCode – ISO 4217 code
 * @returns {string}
 */
export default function getCurrencySymbol(currencyCode = '') {
    const key = currencyCode.toUpperCase();
    return symbols[key] || currencyCode;
}
//# sourceMappingURL=get-currency-symbol.js.map