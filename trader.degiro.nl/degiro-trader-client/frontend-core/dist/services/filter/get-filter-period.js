import startOfDay from '../../utils/date/start-of-day';
// TODO: Fix it! One day can be 25 or 23 hours
const oneDay = 24 /* hours */ * 60 /* minutes */ * 60 /* seconds */ * 1000; /* milliseconds */
// TODO: use {start, end} notation
function getIntervalSnappedToStartOfDays(start, end) {
    return {
        startDate: startOfDay(start),
        endDate: startOfDay(end)
    };
}
function getChangedDateType(startValue, startOldValue, endValue, endOldValue) {
    return startOldValue && Math.abs(startOldValue - startValue) > oneDay
        ? 'start'
        : endOldValue && Math.abs(endOldValue - endValue) > oneDay
            ? 'end'
            : null;
}
/**
 * @todo
 *  This function is overcomplicated, we can split this
 *  functionality to 2 separate and reusable functions
 *
 *      type Interval = {start: Date: end: Date};
 *      type Duration = number;
 *      type IntervalParams =
 *          {start: Date: end: Date}
 *        | {start: Date: duration: Duration}
 *        | {end: Date: duration: Duration};
 *
 *      const getInterval = ( params: IntervalParams) => Interval
 *
 *      type IntervalUpdater = {start: Date} | {end: Date}
 *      type UpdateIntervalOptions = {
 *          minDuration?: Duration,
 *          maxDuration?: Duration
 *      }
 *      const updateInterval = (updater: IntervalUpdater, interval: Interval, options: UpdateIntervalOptions)
 *
 * @param {DateUpdate} startUpdate
 * @param {DateUpdate} endUpdate
 * @param {FilterPeriodOptions} options
 * @returns {DateRange}
 */
export default function getFilterPeriod(startUpdate, endUpdate, options) {
    const { maxDaysRange = Infinity, daysRange = 0 } = options;
    const defaultDuration = daysRange * oneDay;
    const maxDuration = maxDaysRange * oneDay;
    const startValue = (startUpdate && startUpdate.value && startUpdate.value.getTime()) || null;
    const startOldValue = (startUpdate && startUpdate.oldValue && startUpdate.oldValue.getTime()) || null;
    const endValue = (endUpdate && endUpdate.value && endUpdate.value.getTime()) || null;
    const endOldValue = (endUpdate && endUpdate.oldValue && endUpdate.oldValue.getTime()) || null;
    if (!startValue && !endValue) {
        const now = Date.now();
        return getIntervalSnappedToStartOfDays(now - defaultDuration, now);
    }
    if (!startValue && endValue) {
        return getIntervalSnappedToStartOfDays(endValue - defaultDuration, endValue);
    }
    if (startValue && !endValue) {
        return getIntervalSnappedToStartOfDays(startValue, startValue + defaultDuration);
    }
    if (startValue && endValue && endValue - startValue > maxDuration) {
        // Adjust to max duration
        return getChangedDateType(startValue, startOldValue, endValue, endOldValue) === 'start'
            ? getIntervalSnappedToStartOfDays(startValue, startValue + maxDuration)
            : getIntervalSnappedToStartOfDays(endValue - maxDuration, endValue);
    }
    if (startValue && endValue && endValue < startValue) {
        return getChangedDateType(startValue, startOldValue, endValue, endOldValue) === 'start'
            ? getIntervalSnappedToStartOfDays(startValue, startValue + defaultDuration)
            : getIntervalSnappedToStartOfDays(endValue - defaultDuration, endValue);
    }
    // false values of `startValue` and `endValue` have to be checked in above conditions
    return getIntervalSnappedToStartOfDays(startValue, endValue);
}
//# sourceMappingURL=get-filter-period.js.map