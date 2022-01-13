import localize from '../i18n/localize';
const monthKeys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
/**
 *
 * @param {I18n} i18n
 * @param {number} monthIndex 1 - 12
 * @returns {string}
 */
export default function getMonthName(i18n, monthIndex) {
    return localize(i18n, `list.month.${monthKeys[monthIndex - 1]}`);
}
//# sourceMappingURL=get-month-name.js.map