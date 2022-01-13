import moment, { monthsShort } from 'moment';
import {
  memoizeWith, pathOr, includes, reduce, maxBy, times,
} from 'ramda';
import { getMoment } from '../Filters.helper';
import Logger from '../../../utils/logger';

export const FILTER_MONTHS_PICKER_YEARS_LIMIT = 40;
export const MONTHS_PER_ROW = 6;

export const getCurrentYear = () => moment().year();
export const getMonthsShort = () => monthsShort();
export const getLimitedYears = (startYear, limit) => {
  const years = [startYear];
  // eslint-disable-next-line no-plusplus
  for (let x = 1; x <= limit; x++) {
    years.push(startYear + x);
  }
  return years;
};
/**
 * getYearFromYearMonthString
 * @param yearMonth 'YYYY-MM'
 * @returns {number}
 */
export const getYearFromYearMonthString = (yearMonth) => getMoment(yearMonth, 'YYYY-MM').year();

/**
 * getTimestampFromYearMonthString
 * @param yearMonth 'YYYY-MM'
 * @returns {number}
 */
export const getTimestampFromYearMonthString = (yearMonth) => getMoment(yearMonth, 'YYYY-MM').unix();
/**
 * getMaxYearMonthFromEnabledMonths
 * @param enabledMonths
 * @returns {string} 'YYYY-MM'
 */
export const getMaxYearMonthFromEnabledMonths = (enabledMonths) => {
  try {
    if (Array.isArray(enabledMonths)) {
      return reduce(
        maxBy(getTimestampFromYearMonthString), 0, enabledMonths,
      );
    }
  } catch (e) {
    Logger.error(e);
  }
  // Arbitrary maximum month value 12 since this method needs to return a string in YYYY-MM format
  return `${getCurrentYear()}-12`;
};
/**
 * getMaxYearFromEnabledMonths
 * @param enabledMonths
 * @returns {number}
 */
export const getMaxYearFromEnabledMonths = (enabledMonths) => {
  try {
    return getYearFromYearMonthString(
      getMaxYearMonthFromEnabledMonths(enabledMonths),
    );
  } catch (e) {
    Logger.error(e);
  }
  return getCurrentYear();
};
/**
 * getListOfYearsBetween
 * @param startYear
 * @param endYear
 * @returns []
 */
export const getListOfYearsBetween = (startYear, endYear) => {
  try {
    if (startYear <= endYear) {
      return times((n) => startYear + n, (endYear - startYear) + 1);
    }
    return [startYear];
  } catch (e) {
    Logger.error(e);
  }
  return getLimitedYears(getCurrentYear(), FILTER_MONTHS_PICKER_YEARS_LIMIT);
};

export const getTimeStamp = memoizeWith(
  (year, month) => `${year}-${month}`,
  (year, month) => moment({ year, month }).startOf('month').startOf('day').unix(),
);

export const getSelectedMonths = (data) => pathOr([], ['selected'], data);
export const getEnabledMonths = (data) => pathOr([], ['enabledDates'], data);

export const isDateInList = (date, list) => includes(date, list);

export const getMonthsShortToNumericMap = (monthsShortName) => {
  const monthsShortToNumericMap = {};
  monthsShortName.forEach((monthShort) => {
    monthsShortToNumericMap[monthShort] = moment().month(monthShort).format('MM');
  });
  return monthsShortToNumericMap;
};
