/**
 * @description Return percentage of 2 numbers
 * @param {number} firstValue
 * @param {number} secondValue
 * @returns {number}
 */
export default function getPercentage(firstValue, secondValue) {
    if (!secondValue || isNaN(firstValue) || isNaN(secondValue)) {
        return 0;
    }
    return (100 * firstValue) / secondValue;
}
//# sourceMappingURL=get-percentage.js.map