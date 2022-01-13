import { filter, path, pathOr } from 'ramda';
import { KEYBOARD_KEY_ENTER } from '../../../../utils/utils';

export const DEFAULT_LIST_TYPE = 'list';

export const CHECKBOX_SELECTED_TRUE = { selected: true };
export const CHECKBOX_SELECTED_FALSE = { selected: false };
export const getLabel = (data) => pathOr('', ['label'], data);
export const getList = (data) => pathOr({}, ['list'], data);
export const isSingleItemInList = (list) => !!(list && Object.keys(list).length === 1);
export const getItemValue = (event) => path(['currentTarget', 'value'], event);
export const getItemIsChecked = (event) => path(['currentTarget', 'checked'], event);

export const notEnterKeyPressed = (event) => (
  !event
  || !event.key
  || event.key !== KEYBOARD_KEY_ENTER);

const isSelected = (item) => !!item.selected;
export const getSelectedListItems = (data) => Object.keys(filter(isSelected, getList(data)));

export const getActiveListItems = (data) => Object.keys(pathOr({}, ['active'], data));
export const getListItemsSelected = (data) => Object.keys(pathOr({}, ['selected'], data));
