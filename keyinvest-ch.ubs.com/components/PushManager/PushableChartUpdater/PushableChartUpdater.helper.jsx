import {
  getChartClassByDiffFromPrev,
  getDefaultDisplayProperty,
  selectPushDataFromState,
} from '../PushableDefault/PushableDefault.helper';

// eslint-disable-next-line import/prefer-default-export
export const getResultFromPushData = (
  fieldPushData,
  field,
) => {
  const readValueOf = getDefaultDisplayProperty(field);
  const actualPushDataFromState = selectPushDataFromState('act', readValueOf)(fieldPushData);
  const previousPushDataFromState = selectPushDataFromState('prev', readValueOf)(fieldPushData);

  if (readValueOf
    && actualPushDataFromState
    && actualPushDataFromState.v
    && actualPushDataFromState.t) {
    return {
      date: actualPushDataFromState.t,
      value: actualPushDataFromState.v,
      class: getChartClassByDiffFromPrev(previousPushDataFromState.v, actualPushDataFromState.v),
    };
  }
  return {};
};
