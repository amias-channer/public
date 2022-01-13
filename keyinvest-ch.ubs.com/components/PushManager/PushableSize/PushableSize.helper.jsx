import {
  formatNumber,
  getDefaultDisplayProperty,
  selectPushDataFromState,
} from '../PushableDefault/PushableDefault.helper';

export const DEFAULT_PUSHABLE_SIZE_PRECISION = 0;
export const DEFAULT_PUSHABLE_SIZE_PRECISION_MAX = 0;

export const getSizeResultFromPushData = (
  fieldPushData,
  field,
) => {
  const readValueOf = getDefaultDisplayProperty(field);
  const actualPushDataFromState = selectPushDataFromState('act', readValueOf)(fieldPushData);

  if (readValueOf
    && actualPushDataFromState && actualPushDataFromState.s) {
    return {
      result: formatNumber(
        actualPushDataFromState.s,
        DEFAULT_PUSHABLE_SIZE_PRECISION,
        DEFAULT_PUSHABLE_SIZE_PRECISION_MAX,
      ),
    };
  }
  return {};
};
