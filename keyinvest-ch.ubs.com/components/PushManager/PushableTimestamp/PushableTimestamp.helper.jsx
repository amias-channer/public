import moment from 'moment';
import {
  getDefaultDisplayProperty,
  selectPushDataFromState,
} from '../PushableDefault/PushableDefault.helper';

export const formatTimestamp = (date, format = 'HH:mm:ss') => moment(date).format(format);

export const getTimestampResultFromPushData = (
  fieldPushData,
  field,
) => {
  const readValueOf = getDefaultDisplayProperty(field);
  const actualPushDataFromState = selectPushDataFromState('act', readValueOf)(fieldPushData);

  if (readValueOf
    && actualPushDataFromState && actualPushDataFromState.v) {
    return {
      result: actualPushDataFromState.t,
    };
  }
  return {};
};
