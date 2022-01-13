import classNames from 'classnames';
import {
  calculateChangePercent, EMPTY_VALUE,
  formatNumber,
  getDefaultDisplayProperty,
  getMarketsInstrumentClasses,
  selectPushDataFromState,
} from '../PushableDefault/PushableDefault.helper';

export const getChangePercentData = (baseValue, actualValue) => {
  const changePercent = calculateChangePercent(baseValue, actualValue);
  const formattedPercent = formatNumber(changePercent, 2, 2);
  return {
    result: formattedPercent !== EMPTY_VALUE ? `${formattedPercent}%` : EMPTY_VALUE,
    colorClasses: classNames(
      getMarketsInstrumentClasses(changePercent),
    ),
  };
};

export const getChangePercentResultFromPushData = (
  fieldPushData,
  field,
) => {
  const readValueOf = getDefaultDisplayProperty(field);
  const actualPushDataFromState = selectPushDataFromState('act', readValueOf)(fieldPushData);

  if (readValueOf
    && actualPushDataFromState && actualPushDataFromState.v) {
    return getChangePercentData(field.baseValue, actualPushDataFromState.v);
  }
  return {};
};
