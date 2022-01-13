import localize from '../i18n/localize';
const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
/**
 *
 * @param {I18n} i18n
 * @param {number} dayIndex 0-6, Sunday - Saturday : 0 - 6
 * @param {boolean} [fullName]
 * @returns {string}
 */
export default function getDayName(i18n, dayIndex, fullName) {
    return localize(i18n, `labels.days.${fullName ? '' : 'brief.'}${dayKeys[dayIndex]}`);
}
//# sourceMappingURL=get-day-name.js.map