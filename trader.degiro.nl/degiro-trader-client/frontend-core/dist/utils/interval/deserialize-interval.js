/**
 * Parsing examples:
 *      "12/42"            => {start: 12, end: 42}
 *      "-/14"             => {start: -Infinity, end: 42}
 *      "42/-"             => {start: 42, end: Infinity}
 *      "-/-"              => {start: -Infinity, end: Infinity}
 *      "not an interval " => {start: -Infinity, end: Infinity}
 * @param {String} str
 * @returns {Interval}
 */
export default function deserializeInterval(str) {
    const [startStr, endStr] = str.split('/');
    const start = startStr === '-' ? -Infinity : Number(startStr);
    const end = endStr === '-' ? Infinity : Number(endStr);
    return startStr === '' || endStr === '' || isNaN(start) || isNaN(end)
        ? { start: -Infinity, end: Infinity }
        : { start: Math.min(start, end), end: Math.max(start, end) };
}
//# sourceMappingURL=deserialize-interval.js.map