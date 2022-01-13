import { pathOr } from 'ramda';
import { SUB_FILTER_TYPE_INPUT_TEXT_RANGE } from '../Filters.helper';

export const INPUT_TYPE_START = 'start';
export const INPUT_TYPE_END = 'end';

export const RANGE_FILTER_MIN_KEY = 'min';
export const RANGE_FILTER_MAX_KEY = 'max';

export const RANGE_FILTER_START_KEY = 'sliderStart';
export const RANGE_FILTER_END_KEY = 'sliderEnd';

export const EMPTY_STRING = '';

export const getSliderField = (field, data) => pathOr('', ['slider', field], data);

export const getInitialStartValue = (data) => getSliderField(
  RANGE_FILTER_START_KEY,
  data,
) || getSliderField(
  RANGE_FILTER_MIN_KEY,
  data,
);

export const getInitialEndValue = (data) => getSliderField(
  RANGE_FILTER_END_KEY,
  data,
) || getSliderField(
  RANGE_FILTER_MAX_KEY,
  data,
);

export const getInitialValueByType = (type, data) => {
  if (type === 'start') {
    return getInitialStartValue(data);
  }
  if (type === 'end') {
    return getInitialEndValue(data);
  }
  return null;
};

export const areEqualValues = (valOne, valTwo) => valOne === valTwo;

export const areUnEqualValues = (valOne, valTwo) => valOne !== valTwo;
export const isNotDefaultInputValue = (inputType, data) => {
  if (inputType === RANGE_FILTER_START_KEY) {
    return areUnEqualValues(
      getSliderField(
        RANGE_FILTER_START_KEY,
        data,
      ),
      getSliderField(
        RANGE_FILTER_MIN_KEY,
        data,
      ),
    );
  }

  if (inputType === RANGE_FILTER_END_KEY) {
    return areUnEqualValues(
      getSliderField(
        RANGE_FILTER_END_KEY,
        data,
      ),
      getSliderField(
        RANGE_FILTER_MAX_KEY,
        data,
      ),
    );
  }
  return false;
};

export const getCurrentAppliedRangeFilters = (
  appliedFilters,
) => pathOr({}, [SUB_FILTER_TYPE_INPUT_TEXT_RANGE], appliedFilters);

export const isAppliedFilterValuesSet = (appliedFilters) => {
  let areAppliedFilterValuesSet = false;
  if (appliedFilters
    && appliedFilters[SUB_FILTER_TYPE_INPUT_TEXT_RANGE]) {
    areAppliedFilterValuesSet = true;
  }
  return areAppliedFilterValuesSet;
};
