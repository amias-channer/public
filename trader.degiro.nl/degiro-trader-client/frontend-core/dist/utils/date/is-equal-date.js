/**
 * @description Compare 2 dates by their value excluding time (can be added as options.includeTime = true if needed)
 * @param {Date} firstDate
 * @param {Date} secondDate
 * @returns {boolean}
 */
export default function isEqualDate(firstDate, secondDate) {
    return (firstDate.getDate() === secondDate.getDate() &&
        firstDate.getMonth() === secondDate.getMonth() &&
        firstDate.getFullYear() === secondDate.getFullYear());
}
//# sourceMappingURL=is-equal-date.js.map