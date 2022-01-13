const presets = {
    amount: {
        fractionSize: 2,
        minFractionSize: 2,
        separateThousands: true
    },
    integerAmount: {
        fractionSize: 0,
        separateThousands: true
    },
    percent: {
        fractionSize: 2,
        minFractionSize: 2,
        separateThousands: true
    },
    price: {
        fractionSize: 4,
        minFractionSize: 2,
        separateThousands: true
    },
    orderInputPrice: {
        fractionSize: 6,
        minFractionSize: 0,
        separateThousands: true
    }
};
/**
 * @description We should reuse Intl.NumberFormat instances for better performance
 *  https://v8.dev/blog/intl#performance
 *  https://github.com/formatjs/react-intl/issues/27#issuecomment-61128824
 * @type {{[key: string]: Intl.NumberFormat}}
 */
const formattersCache = {};
const isZeroChar = (char) => char === '0';
/**
 * @see {@link http://confluence/display/WF/Parsing+and+formatting+data}
 * @param {number|string} input
 * @param {NumberFormattingOptions} options
 * @returns {string}
 */
export default function formatNumber(input, options) {
    const presetOptions = options.preset ? presets[options.preset] : undefined;
    const { thousandDelimiter = '', fractionDelimiter = '', roundSize } = options;
    let { separateThousands = true, fractionSize, minFractionSize } = options;
    if ((presetOptions === null || presetOptions === void 0 ? void 0 : presetOptions.separateThousands) != null) {
        separateThousands = presetOptions.separateThousands;
    }
    if ((presetOptions === null || presetOptions === void 0 ? void 0 : presetOptions.minFractionSize) != null) {
        minFractionSize = presetOptions.minFractionSize;
    }
    if ((presetOptions === null || presetOptions === void 0 ? void 0 : presetOptions.fractionSize) != null) {
        fractionSize = presetOptions.fractionSize;
    }
    if (Number(minFractionSize) > Number(fractionSize)) {
        fractionSize = minFractionSize;
    }
    // Intl.NumberFormat rounds the value if there is no fraction
    const maximumFractionDigits = roundSize == null ? (fractionSize == null ? 20 : fractionSize + 1) : roundSize;
    const minimumFractionDigits = roundSize == null || roundSize >= Number(minFractionSize)
        ? minFractionSize || 0 // Intl.NumberFormat default is 1
        : roundSize || 0;
    // Use changeable parts of Intl.NumberFormatOptions
    const formatterCacheKey = `${separateThousands};${minimumFractionDigits};${maximumFractionDigits}`;
    let formatter = formattersCache[formatterCacheKey];
    if (!formatter) {
        // we use fixed formatter locale to make our formatter run in the environments with limited ICU data packages,
        // e.g. Node v10.x, some rare Android browsers, etc. 'en-US' is included to "small-icu" package by all engines
        formatter = new Intl.NumberFormat('en-US', {
            style: 'decimal',
            useGrouping: separateThousands,
            minimumFractionDigits,
            maximumFractionDigits
        });
        formattersCache[formatterCacheKey] = formatter;
    }
    const numericInput = Number(input) || 0; // NaN || 0
    const absNumericInput = Math.abs(numericInput);
    let result = formatter.format(numericInput);
    const formatterResultLength = result.length;
    const fractionParts = [];
    let delimitedInteger = '';
    let formatterThousandDelimiter = '';
    let hasFraction = false;
    /**
     * 1. Safari <= 12, Edge < 18 don't support Intl.NumberFormat.prototype.formatToParts
     * 2. see https://web-sentry.i.degiro.eu/degiroweb/degiro-trader-frontend/issues/1976
     * 3. [TRADER-1163] Chrome 88 broke our default (en-US) formatting
     * 3.1. see https://bugs.chromium.org/p/chromium/issues/detail?id=1169369&q=NumberFormat&can=2
     */
    for (let i = 0; i < formatterResultLength; i++) {
        const char = result[i];
        if (char === '.' || char === ',') {
            if (separateThousands && absNumericInput >= 1000 && !formatterThousandDelimiter) {
                formatterThousandDelimiter = char;
            }
            if (char === formatterThousandDelimiter) {
                delimitedInteger += thousandDelimiter;
            }
            else {
                hasFraction = true;
            }
        }
        else if (hasFraction) {
            fractionParts.push(char);
        }
        else {
            delimitedInteger += char;
        }
    }
    if (fractionSize === 0) {
        result = delimitedInteger;
    }
    else {
        const currentFractionLength = fractionParts.length;
        const minFractionLength = minFractionSize || 0;
        let expectedFractionLength = Math.min(currentFractionLength, fractionSize !== null && fractionSize !== void 0 ? fractionSize : currentFractionLength);
        while (expectedFractionLength < minFractionLength) {
            // add trailing zeros to have a minimal fraction length
            fractionParts[expectedFractionLength] = '0';
            expectedFractionLength++;
        }
        // remove trailing zeros after minimal fraction length
        while (expectedFractionLength > minFractionLength && fractionParts[expectedFractionLength - 1] === '0') {
            expectedFractionLength--;
        }
        // remove redundant numbers at the end of the fraction block
        fractionParts.length = expectedFractionLength;
        if (delimitedInteger === '-0' && fractionParts.every(isZeroChar)) {
            delimitedInteger = '0';
            if (!minFractionSize) {
                expectedFractionLength = 0;
            }
        }
        result = expectedFractionLength
            ? `${delimitedInteger}${fractionDelimiter}${fractionParts.join('')}`
            : delimitedInteger;
    }
    return result === '-0' ? '0' : result;
}
//# sourceMappingURL=format-number.js.map