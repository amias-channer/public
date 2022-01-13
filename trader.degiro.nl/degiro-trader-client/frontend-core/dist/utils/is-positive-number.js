const nonZeroNumberPattern = /[1-9]/;
/**
 * @param {number|string} value
 * @returns {boolean}
 */
export default function isPositiveNumber(value) {
    const str = String(value);
    return str[0] !== '-' && nonZeroNumberPattern.test(str);
}
//# sourceMappingURL=is-positive-number.js.map