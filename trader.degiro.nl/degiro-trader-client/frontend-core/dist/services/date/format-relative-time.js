import isValueInInterval from '../../utils/interval/is-value-in-interval';
const secondMs = 1000;
const minuteMs = 60 * secondMs;
const hourMs = 60 * minuteMs;
const dayMs = 24 * hourMs;
const weekMs = 7 * dayMs;
const monthMs = 30 * dayMs;
const yearMs = 365 * dayMs;
const timeIntervals = [
    [{ start: yearMs, end: Infinity }, yearMs, 'year'],
    [{ start: monthMs, end: yearMs }, monthMs, 'month'],
    [{ start: weekMs, end: monthMs }, weekMs, 'week'],
    [{ start: dayMs, end: weekMs }, dayMs, 'day'],
    [{ start: hourMs, end: dayMs }, hourMs, 'hour'],
    [{ start: minuteMs, end: hourMs }, minuteMs, 'minute'],
    [{ start: 0, end: secondMs }, secondMs, 'second']
];
/**
 *
 * @param {Date} date
 * @param {Date} baseDate
 * @param {string} locale for Intl.RelativeTimeFormat.format locale
 * @param {Intl.RelativeTimeFormatOptions} [options]
 * @returns {string | undefined} If Intl.RelativeTimeFormat is not supported, return undefined
 */
export default function formatRelativeTime(date, baseDate, locale, options) {
    // TODO: remove this check once Intl.RelativeTimeFormat is supported on every browser
    // Change function signature to return {string}
    if (!Intl.RelativeTimeFormat) {
        return;
    }
    const datesDiffMs = date.getTime() - baseDate.getTime();
    const absDatesDiffMs = Math.abs(datesDiffMs);
    const [, unitMs, unit] = timeIntervals.find(([interval]) => isValueInInterval(absDatesDiffMs, interval)) ||
        timeIntervals[0];
    const unitValue = datesDiffMs / unitMs;
    return new Intl.RelativeTimeFormat(locale, { style: 'narrow', ...options }).format(unitValue > 0 ? Math.floor(unitValue) : Math.ceil(unitValue), unit);
}
//# sourceMappingURL=format-relative-time.js.map