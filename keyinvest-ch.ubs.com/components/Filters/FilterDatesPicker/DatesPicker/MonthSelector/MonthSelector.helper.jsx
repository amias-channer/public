import { identity, memoizeWith, splitEvery } from 'ramda';
import i18n from '../../../../../utils/i18n';
import { isDateInList, getMoment } from '../../../Filters.helper';

export const generateMonths = memoizeWith(identity, () => [
  i18n.t('January'),
  i18n.t('February'),
  i18n.t('March'),
  i18n.t('April'),
  i18n.t('May'),
  i18n.t('June'),
  i18n.t('July'),
  i18n.t('August'),
  i18n.t('September'),
  i18n.t('October'),
  i18n.t('November'),
  i18n.t('December'),
]);

export const MONTHS_PER_ROW = 6;

export const getChunkedMonths = memoizeWith(
  identity,
  () => splitEvery(MONTHS_PER_ROW, generateMonths()), [MONTHS_PER_ROW],
);

export const getMonthIndex = (
  indexInRow, indexInChunk,
) => (indexInRow * MONTHS_PER_ROW) + indexInChunk;

export const isMonthInDates = (year, month, dates) => isDateInList(
  getMoment({ year, month }).unix(), dates, 'YYYYMM',
);
