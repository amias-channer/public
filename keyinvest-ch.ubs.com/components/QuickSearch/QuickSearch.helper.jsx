import { path, pathOr } from 'ramda';
import Logger from '../../utils/logger';
import {
  pathOrBoolean,
  pathOrObject,
  pathOrString,
} from '../../utils/typeChecker';

export const SEARCH_TEXT_START = '%s';
export const SEARCH_TEXT_END = '%e';

export const getInnerTextFromEvent = (event) => pathOr('', ['target', 'innerText'], event);
export const getValueFromEvent = (event) => pathOr('', ['target', 'value'], event);

export const getSelectedUnderlying = (data) => pathOr('', ['underlying', 'selected', 'label'], data);
export const getSelectedUnderlyingSin = (data) => pathOr('', ['underlying', 'selected', 'sin'], data);
export const getUnderlyingDefaultAdjustment = (data) => pathOr('', ['adjustments', 'default'], data);
export const getHeading = (data) => pathOrString('', ['titleFromCMS'], data);
export const getShowHeadingSettings = (data) => pathOrObject({
  mobile: false, tablet: false, notebook: false, desktop: false,
}, ['showTitleOnDevices'], data);
export const shouldDisplayHeading = (responsiveMode, displaySettings) => {
  if (!responsiveMode || !displaySettings) {
    return false;
  }
  return !!displaySettings[responsiveMode];
};
export const getUnderlyingAdjustmentBySin = (sin, data) => {
  const adjustment = path(['adjustments', 'underlyings', sin], data);
  if (!adjustment) {
    return getUnderlyingDefaultAdjustment(data);
  }
  return adjustment;
};

const shouldReturnDefaultValue = (
  value,
  adjustment,
) => Number.isNaN(value) || Number.isNaN(adjustment);

export const calculateStartByAdjustmentFormula = (startValue, adjustment) => {
  const DEFAULT_VALUE = '';
  const startVal = parseFloat(startValue);
  const adjustmentVal = parseFloat(adjustment);
  if (shouldReturnDefaultValue(startVal, adjustmentVal)) {
    return DEFAULT_VALUE;
  }
  try {
    return String(Math.round(startVal * (1 - adjustmentVal)));
  } catch (e) {
    Logger.error(e);
    return DEFAULT_VALUE;
  }
};

export const calculateEndByAdjustmentFormula = (endValue, adjustment) => {
  const DEFAULT_VALUE = '';
  const endVal = parseFloat(endValue);
  const adjustmentVal = parseFloat(adjustment);
  if (shouldReturnDefaultValue(endVal, adjustmentVal)) {
    return DEFAULT_VALUE;
  }
  try {
    return String(Math.round(endVal * (1 + adjustmentVal)));
  } catch (e) {
    Logger.error(e);
    return DEFAULT_VALUE;
  }
};

export const isLeverageOfTypeRange = (productType) => pathOrBoolean(false, ['isLeverageFilterOfTypeRange'], productType);

export const calculateMinRangeLeverageFromLowRange = (middleRangeLeverageValue) => {
  try {
    const parsedLowRangeValue = parseInt(middleRangeLeverageValue, 10);
    if (!Number.isInteger(parsedLowRangeValue) || parsedLowRangeValue <= 0) {
      Logger.error('QuickSearch.helper::calculateMinRangeFromLowRange(): Parsed low range');
      return middleRangeLeverageValue;
    }
    return parsedLowRangeValue - 1;
  } catch (e) {
    Logger.error('QuickSearch.helper::calculateMinRangeFromLowRange()', e);
    return middleRangeLeverageValue;
  }
};

export const calculateMaxRangeLeverageFromLowRange = (middleRangeLeverageValue) => {
  try {
    const parsedLowRangeValue = parseInt(middleRangeLeverageValue, 10);
    if (!Number.isInteger(parsedLowRangeValue)) {
      Logger.error('QuickSearch.helper::calculateMaxRangeFromLowRange(): Parsed low range');
      return middleRangeLeverageValue;
    }
    return parsedLowRangeValue + 1;
  } catch (e) {
    Logger.error('QuickSearch.helper::calculateMaxRangeFromLowRange()', e);
    return middleRangeLeverageValue;
  }
};
