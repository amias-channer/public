import classNames from 'classnames';
import {
  EMPTY_VALUE,
  formatNumber,
  getDefaultDisplayProperty,
  getMarketsInstrumentClasses, getMaxPrecision, getMinPrecision,
  selectPushDataFromState,
} from '../PushableDefault/PushableDefault.helper';

export const calculateChangeAbsolute = (baseValue, newValue) => {
  if (
    typeof newValue !== 'undefined'
    && typeof baseValue !== 'undefined'
    && newValue !== null
    && baseValue !== null
    && !Number.isNaN(parseFloat(newValue))
    && !Number.isNaN(parseFloat(baseValue))
    && parseFloat(baseValue) > 0
  ) {
    return newValue - baseValue;
  }
  return EMPTY_VALUE;
};

export const getChangeAbsoluteData = (baseValue, actualValue, minPrecision, maxPrecision) => {
  const changeAbsolute = calculateChangeAbsolute(baseValue, actualValue);
  return {
    result: `${formatNumber(changeAbsolute, minPrecision, maxPrecision)}`,
    colorClasses: classNames(
      getMarketsInstrumentClasses(changeAbsolute),
    ),
  };
};

export const getChangeAbsoluteResultFromPushData = (
  fieldPushData,
  field,
) => {
  const readValueOf = getDefaultDisplayProperty(field);
  const actualPushDataFromState = selectPushDataFromState('act', readValueOf)(fieldPushData);

  if (readValueOf
    && actualPushDataFromState && actualPushDataFromState.v) {
    return getChangeAbsoluteData(
      field.baseValue,
      actualPushDataFromState.v,
      getMinPrecision()(field),
      getMaxPrecision()(field),
    );
  }
  return {};
};
