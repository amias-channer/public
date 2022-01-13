import { path, pathOr, filter } from 'ramda';

export const STATE_KEY_BACKEND_SEARCHABLE_DROPDOWN_LIST = 'backendSearchableDropdown';

export const getItemValue = (event) => path(['currentTarget', 'value'], event);
export const getItemIsChecked = (event) => path(['currentTarget', 'checked'], event);
export const getListItems = (data) => pathOr({}, ['fieldValue'], data);

export const isSelected = (item) => !!(item && item.selected && item.selected === true);
export const getSelectedListItems = (list) => filter(isSelected, list);

export const isSingleItemSelectDropdown = (data) => pathOr(false, ['settings', 'onlySingleItemSelection'], data);

export const getSearchUrl = (data) => pathOr('', ['settings', 'searchUrl'], data);

export const defaultDataTransform = (data) => data || {};

export const getPushPriceUrl = (data) => pathOr('', ['settings', 'pushPriceUrl'], data);

export const getItemDataValue = (data) => path(['value'], data);
