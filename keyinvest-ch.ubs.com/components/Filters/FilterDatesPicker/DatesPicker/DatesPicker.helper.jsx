import { getMoment, momentFromTimestamp } from '../../Filters.helper';

// eslint-disable-next-line import/prefer-default-export
export const getInitialFocusDate = (activeDates, enabledDates) => {
  if (activeDates && activeDates.length) {
    const t = momentFromTimestamp(activeDates[0]);
    if (t.isValid()) {
      return t;
    }
  }
  if (enabledDates && enabledDates.length) {
    const t = momentFromTimestamp(enabledDates[0]);
    if (t.isValid()) {
      return t;
    }
  }
  return getMoment();
};
