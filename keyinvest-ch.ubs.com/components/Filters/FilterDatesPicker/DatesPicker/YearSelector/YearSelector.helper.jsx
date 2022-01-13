import { memoizeWith, reverse, times } from 'ramda';
import { isDateInList, getMoment } from '../../../Filters.helper';

export const MAX_YEARS = 40;

export const generateYears = memoizeWith(
  (year, min, max) => `${year}-${min}-${max}`,
  (year, min, max) => [
    ...reverse(times((n) => (year - 1) - n, min ? year - min : MAX_YEARS)),
    year,
    ...times((n) => (year + 1) + n, max ? max - year : MAX_YEARS),
  ],
);

export const isYearInDates = (year, dates) => isDateInList(
  getMoment({ year }).unix(), dates, 'YYYY',
);
