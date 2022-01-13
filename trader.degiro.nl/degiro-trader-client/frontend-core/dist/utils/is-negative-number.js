/**
 * @param {number|string} value
 * @example
 *  '-1.22' => true
 *  '1.22'  => false
 *  -1.22   => true
 *  1.22    => false
 * @returns {boolean}
 */
export default function isNegativeNumber(value) {
    return String(value)[0] === '-';
}
//# sourceMappingURL=is-negative-number.js.map