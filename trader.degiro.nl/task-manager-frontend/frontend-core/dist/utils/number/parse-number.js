const minusSignCode = '-'.charCodeAt(0);
const zeroNumberCode = '0'.charCodeAt(0);
const nineNumberCode = '9'.charCodeAt(0);
const commaCode = ','.charCodeAt(0);
const pointCode = '.'.charCodeAt(0);
/**
 * @example
 * parseNumber('12,56.70') => 1256.7
 * parseNumber('12.56,70') => 1256.7
 * @see {@link http://confluence/display/WF/Parsing+and+formatting+data}
 * @param {string} input
 * @param {{thousandDelimiter: string}} [options]
 * @returns {number}
 */
export default function parseNumber(input, options) {
    if (!input) {
        return 0;
    }
    const thousandDelimiterCode = options && options.thousandDelimiter && options.thousandDelimiter.charCodeAt(0);
    const stack = [];
    let isInteger = true;
    let i = input.length;
    let isNegative = false;
    while (i--) {
        const symbolCode = input.charCodeAt(i);
        if (symbolCode >= zeroNumberCode && symbolCode <= nineNumberCode) {
            isNegative = false;
            stack.unshift(symbolCode);
        }
        else if (symbolCode === minusSignCode) {
            isNegative = true;
        }
        else if (isInteger &&
            thousandDelimiterCode !== symbolCode &&
            (symbolCode === commaCode || symbolCode === pointCode)) {
            isInteger = false;
            // use '.' as decimals separator
            stack.unshift(pointCode);
        }
    }
    if (isNegative) {
        stack.unshift(minusSignCode);
    }
    const str = String.fromCharCode.apply(String, stack);
    if (isInteger) {
        return parseInt(str, 10);
    }
    return parseFloat(str);
}
//# sourceMappingURL=parse-number.js.map