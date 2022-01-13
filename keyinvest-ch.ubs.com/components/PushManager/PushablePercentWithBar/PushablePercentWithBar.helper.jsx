import classNames from 'classnames';
import Logger from '../../../utils/logger';
import {
  EMPTY_VALUE,
  calculateChangePercent,
  getDefaultDisplayProperty,
  getMarketsInstrumentClasses,
  selectPushDataFromState,
  formatNumber,
} from '../PushableDefault/PushableDefault.helper';

export const calculateBarWidth = (percent, maxForPercentCalc) => {
  if (percent !== undefined && maxForPercentCalc) {
    const width = Math.abs(percent) / maxForPercentCalc;
    if (width > 100) {
      return 100;
    }
    if (width < 0) {
      return 0;
    }
    return parseFloat(width).toFixed(2);
  }
  Logger.warn('PUSHABLE_PERCENT_WITH_BAR', 'calculateBarWidth', 'Unable to calculate with', percent, maxForPercentCalc);
  return formatNumber(0);
};

export const getChangePercentWithBarData = (baseValue, actualValue, maxForPercentCalc) => {
  const changePercent = calculateChangePercent(baseValue, actualValue);
  const formattedPercent = formatNumber(changePercent, 2, 2);
  const barWidth = calculateBarWidth(changePercent, maxForPercentCalc);
  return {
    barWidth: formattedPercent !== EMPTY_VALUE ? barWidth : 0,
    result: formattedPercent !== EMPTY_VALUE ? `${formattedPercent}%` : EMPTY_VALUE,
    colorClasses: classNames(
      getMarketsInstrumentClasses(changePercent),
    ),
  };
};

export const getPercentWithBarResultFromPushData = (
  fieldPushData,
  field,
  displayMode,
  maxForPercentCalc,
) => {
  const readValueOf = getDefaultDisplayProperty(field);
  const actualPushDataFromState = selectPushDataFromState('act', readValueOf)(fieldPushData);

  if (readValueOf
    && actualPushDataFromState && actualPushDataFromState.v) {
    return getChangePercentWithBarData(
      field.baseValue,
      actualPushDataFromState.v,
      maxForPercentCalc,
    );
  }
  return {};
};
