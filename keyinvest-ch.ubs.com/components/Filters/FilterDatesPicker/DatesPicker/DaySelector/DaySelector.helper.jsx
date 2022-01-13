import {
  concat, memoizeWith, remove, splitEvery, times,
} from 'ramda';
import i18n from '../../../../../utils/i18n';
import { getMoment } from '../../../Filters.helper';

export const DAYS_PER_WEEK = 7;
export const START_WEEK_FROM = 1; // 0: Sunday, 1: Monday ...

export const getMonthYearTile = memoizeWith(
  (year, month) => `${year}${month}`,
  (year, month) => `${i18n.t(getMoment().set({ year, month }).format('MMMM'))} ${year}`,
);

export const getAllDatesInMonth = (year, month) => {
  const date = getMoment(`${year}-${month + 1}`, 'YYYY-MM');
  const daysInMonth = date.daysInMonth();
  return times(
    (day) => getMoment(date).date(day + 1).unix(),
    daysInMonth > 0 ? daysInMonth : 0,
  );
};

export const paddingCells = (number) => times(() => null, number > 0 ? number : 0);

export const generateDatesAsRows = memoizeWith((year, month) => `${year}${month}`, (year, month) => {
  const daysOfMonth = getAllDatesInMonth(year, month);
  const startOfMonth = getMoment({ year, month }).startOf('month').day();
  if (START_WEEK_FROM > 0 && startOfMonth === 0) { // In case start of the month is Sunday
    return concat(
      [[
        ...paddingCells(DAYS_PER_WEEK - START_WEEK_FROM),
        ...times((x) => daysOfMonth[x], START_WEEK_FROM),
      ]],
      splitEvery(DAYS_PER_WEEK, remove(0, START_WEEK_FROM, daysOfMonth)),
    );
  }
  return splitEvery(
    DAYS_PER_WEEK,
    concat(paddingCells(startOfMonth - START_WEEK_FROM), daysOfMonth),
  );
});
