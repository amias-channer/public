// Filter Types
import {
  compose, includes, map, pathOr,
} from 'ramda';
import moment from 'moment';

export const FILTER_TYPE_DROPDOWN = 'dropdown';
export const FILTER_TYPE_UNDERLYINGS_DROPDOWN = 'underlyings_dropdown';

export const SUB_FILTER_TYPE_INPUT_TEXT = 'inputTextFilter';
export const SUB_FILTER_TYPE_CHECKBOXES = 'checkboxesFilter';
export const SUB_FILTER_TYPE_INPUT_TEXT_RANGE = 'inputTextRangeFilter';

export const notEmptyList = (list) => list && Object.keys(list).length > 0;

const EMPTY_OBJ = {};
export const getAppliedFilters = (state, props) => pathOr(EMPTY_OBJ, ['appliedListFilters', props.uniqDefaultListId, props.filterKey])(state);

export const getData = (state, props) => pathOr(EMPTY_OBJ, ['data'], props);

// Nested Lists Filters
export const filterListByInputText = (text, list) => {
  Object.keys(list).forEach((item) => {
    list[item].isVisible = !(list[item].label
      && list[item].label.toLowerCase().indexOf(text.toLowerCase()) < 0);
    if (list[item].list) {
      filterListByInputText(text, list[item].list);
    }
  });
  return list;
};

export const getVisibleItems = (list) => Object.keys(list).map((item) => {
  if (list[item].isVisible) {
    return list[item];
  }
  if (list[item].list) {
    return getVisibleItems(list[item].list);
  }
  return null;
});

// Date Filters

export const getMoment = (...params) => moment(...params);

export const momentFromTimestamp = (timestamp) => getMoment(timestamp, 'X'); // .utc(true);

export const isDateInList = (date, list, checkWithFormat = 'YYYYMMDD') => {
  if (!date || !list || !list.length) {
    return false;
  }
  const momentMap = map((d) => momentFromTimestamp(d).format(checkWithFormat));
  const momentDate = momentFromTimestamp(date).format(checkWithFormat);
  return compose(includes(momentDate), momentMap)(list);
};
