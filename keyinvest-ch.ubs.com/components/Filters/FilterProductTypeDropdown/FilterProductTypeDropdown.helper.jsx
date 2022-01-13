import { pathOr, flatten } from 'ramda';

export const EMPTY_SEARCH_STRING = '';

export const getListData = (data) => pathOr({}, ['list'], data);
export const getSelectedProductType = (data) => pathOr('', ['selected', 'label'], data);
export const getLabel = (data) => pathOr('', ['label'], data);
export const isSingleItemInList = (list) => !!(list && list.length === 1);

export const getFlattenedList = (list) => flatten(list);
