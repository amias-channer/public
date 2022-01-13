import { pathOr, filter } from 'ramda';
import { getNumbers } from '../../../utils/utils';

export const DEFAULT_LIST_TYPE = 'list';
export const MULTI_LIST_TYPE = 'listMulti';
export const DEFAULT_SELECTED_CHAR_ALL = 'all';
export const SELECTED_CHAR_NUMERIC = 'numeric';

export const SUB_FILTER_TYPE_CHARACTER = 'characterFilter';
export const SUB_FILTER_TYPE_LIST_TYPE = 'listTypeFilter';

export const getLabel = (data) => pathOr('', ['label'])(data);

export const getAppliedFilterValueByType = (
  filterType,
  defaultValue,
  data,
) => pathOr(defaultValue, [filterType], data);

export const getFilterListType = (
  appliedFilters,
) => (
  appliedFilters
  && SUB_FILTER_TYPE_LIST_TYPE in appliedFilters
    ? appliedFilters[SUB_FILTER_TYPE_LIST_TYPE] : DEFAULT_LIST_TYPE
);

export const getActiveItems = (data) => Object.keys(pathOr({}, ['active'], data));

const isListItemSelected = (item) => item && item.selected;
export const getSelectedListItems = (
  list,
) => (list ? Object.keys(filter(isListItemSelected, list)) : []);

const itemLabelStartsWithNumber = (numbers) => (
  item,
) => item && item.label && numbers.indexOf(item.label[0]) > -1;
const filterListByNumbers = (numbers, list) => filter(itemLabelStartsWithNumber(numbers), list);

const itemLabelStartsWithChar = (
  char,
) => (item) => item.label[0].toLowerCase() === char.toLowerCase();
export const filterListByCharacter = (character, list) => {
  if (character === DEFAULT_SELECTED_CHAR_ALL) {
    return list;
  }

  if (character === SELECTED_CHAR_NUMERIC) {
    return filterListByNumbers(getNumbers(), list);
  }

  return filter(itemLabelStartsWithChar(
    character,
  ), list);
};

const stringContainsText = (
  text,
) => (item) => item.label.toLowerCase().indexOf(text.toLowerCase()) > -1;
export const filterListByInputText = (text, list) => {
  if (!text) {
    return list;
  }
  return filter(
    stringContainsText(
      text,
    ), list,
  );
};
