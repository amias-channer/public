import { pathOr } from 'ramda';

export const EMPTY_SEARCH_STRING = '';
export const EMPTY_OBJ = {};

export const FILTER_COLUMNS_LAYOUT_CONFIG = {
  0: { // Nesting Level
    default: 3, // Number of columns for default resolution
    1023: 1, // Number of columns for max resolution 1023
  },
  1: {
    default: 1,
    1023: 1,
  },
};

export const DEFAULT_LIST_TYPE = 'list';
export const SUB_FILTER_TYPE_LIST_TYPE = 'listTypeFilter';
export const getAppliedFilterValueByType = (
  filterType,
  defaultValue,
  data,
) => pathOr(defaultValue, [filterType], data);

export const getListData = (data) => pathOr({}, ['list'], data);
export const getData = (state, props) => pathOr(EMPTY_OBJ, ['data'], props);

export const getLabel = (data) => pathOr('', ['label'], data);
