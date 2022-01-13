import { isDateInList, momentFromTimestamp } from '../../../../Filters.helper';

export const getCellDate = (day) => (day ? momentFromTimestamp(day).startOf('day') : null);
export const isCellDateActive = (date, activeDates) => date && isDateInList(date, activeDates);
export const getCellDateLabel = (date) => (date ? momentFromTimestamp(date).format('D') : '');

export const isDateDisabled = (
  date, disabledDates, enabledDates,
) => (disabledDates && isDateInList(date, disabledDates))
  || (!isDateInList(date, enabledDates));
