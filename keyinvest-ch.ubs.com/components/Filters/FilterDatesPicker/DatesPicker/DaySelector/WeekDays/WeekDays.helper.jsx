import {
  flatten, identity, memoizeWith, pipe, reverse, splitAt,
} from 'ramda';
import i18n from '../../../../../../utils/i18n';

export const getWeekDays = memoizeWith(identity, () => [
  i18n.t('Sunday'),
  i18n.t('Monday'),
  i18n.t('Tuesday'),
  i18n.t('Wednesday'),
  i18n.t('Thursday'),
  i18n.t('Friday'),
  i18n.t('Saturday'),
]);

export const generateWeekDays = (startWeekFrom) => {
  const defaultWeekDays = getWeekDays();
  if (startWeekFrom > 0) {
    const rotate = pipe(splitAt, reverse, flatten);
    return rotate(startWeekFrom, defaultWeekDays);
  }
  return defaultWeekDays;
};
