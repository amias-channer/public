const valueSizes = [
    ['T', 1000000000000],
    ['B', 1000000000],
    ['M', 1000000],
    ['K', 1000]
];
const defaultSizes = ['T', 'B', 'M', 'K'];
/**
 * @example
 * abbreviateNumber(1_000) => [1, 'K', 1_000]
 * @see {@link http://confluence/display/WF/Parsing+and+formatting+data}
 * @param {number} numericValue
 * @param {NumberAbbrSize[]} [sizes]
 * @returns {[number, string, number]}
 */
export default function abbreviateNumber(numericValue, sizes = defaultSizes) {
    let suffix = '';
    let magnitude = 1;
    const absoluteValue = Math.abs(numericValue);
    const valueSize = valueSizes.find(([size, value]) => absoluteValue >= value && sizes.includes(size));
    if (valueSize) {
        suffix = valueSize[0];
        magnitude = valueSize[1];
        numericValue /= magnitude;
    }
    return [numericValue, suffix, magnitude];
}
//# sourceMappingURL=abbreviate-number.js.map