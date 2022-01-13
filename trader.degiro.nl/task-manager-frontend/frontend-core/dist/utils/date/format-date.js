import isEqualDate from './is-equal-date';
import padNumber from '../number/pad-number';
const today = new Date();
const formattingTokensPattern = /(\[[^[]*])|(\\)?(ss|mm|HH|YYYY|MM|DD|.)/g;
const formatters = {
    // Month: 01, 02, ..., 12
    MM: (date) => padNumber(date.getMonth() + 1),
    // Day of month: 01, 02, ..., 31
    DD: (date) => padNumber(date.getDate()),
    // Year: 1900, 1901, ..., 2099
    YYYY: (date) => String(date.getFullYear()),
    // Hour: 00, 01, ..., 23
    HH: (date) => padNumber(date.getHours()),
    // Minute: 00, 01, ..., 59
    mm: (date) => padNumber(date.getMinutes()),
    // Second: 00, 01, ..., 59
    ss: (date) => padNumber(date.getSeconds())
};
/**
 * @description Date formatter. Supported tokens:
 *  MM   - 01, 02, ..., 12
 *  DD   - 01, 02, ..., 31
 *  YYYY - 1900, 1901, ..., 2099
 *  HH   - 00, 01, ... 23
 *  mm   - 00, 01, ..., 59
 *  ss   - 00, 01, ..., 59
 * @see {@link http://confluence/display/WF/Parsing+and+formatting+data}
 * @param {Date} date
 * @param {string|undefined} formatString
 * @param {FormatDateOptions} [options]
 * @returns {string}
 */
export default function formatDate(date, formatString, options) {
    if (!formatString) {
        return '';
    }
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    const dateAsString = String(date);
    if (dateAsString === 'Invalid Date') {
        return dateAsString;
    }
    if (options && options.todayFormat && isEqualDate(date, today)) {
        formatString = options.todayFormat;
    }
    const tokens = formatString.match(formattingTokensPattern);
    if (!tokens) {
        return formatString;
    }
    const tokensCount = tokens.length;
    for (let i = 0; i < tokensCount; i++) {
        const formatter = formatters[tokens[i]];
        if (formatter) {
            tokens[i] = formatter(date);
        }
    }
    return tokens.join('');
}
//# sourceMappingURL=format-date.js.map