const patterns = {
    "'": /&#39;/g,
    '(': /&#40;/g,
    ')': /&#41;/g,
    '<': /&lt;/g,
    '>': /&gt;/g
};
/**
 * @description Unescape special chars
 * @param {string} str
 * @returns {string}
 */
export default function unescape(str) {
    return Object.entries(patterns).reduce((result, [symbol, pattern]) => result.replace(pattern, symbol), str);
}
//# sourceMappingURL=unescape.js.map