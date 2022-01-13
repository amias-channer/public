import {
  prop, ascend, sortWith, path,
} from 'ramda';
import { isEmptyData } from '../../utils/utils';
import Logger from '../../utils/logger';

export const hasNestedList = (list) => !!(list && list.list && Object.keys(list.list).length > 0);
/**
 * isNotVisibleItem function will return TRUE only if
 * the item is an object AND
 * has property isVisible AND
 * isVisible is equal to FALSE
 *
 * Any other case will return FALSE
 *
 * @param item
 * @returns {boolean}
 */
export const isNotVisibleItem = (item) => {
  if (item && typeof item === 'object') {
    const isVisible = path(['isVisible'], item);
    return isVisible === false;
  }
  return false;
};
export const getTooltip = (item) => {
  if (item.tooltip) {
    if (Array.isArray(item.tooltip)) {
      return item.tooltip;
    }
    if (typeof item.tooltip === 'object') {
      return [item.tooltip];
    }
  }
  return null;
};
export const LIST_DISPLAY_STYLE_COLUMNS = 'columns';

export const SORT_KEY_PRIORITY_1 = 'order';
export const SORT_KEY_PRIORITY_2 = 'label';

const sortArrByOrder = sortWith([
  ascend(prop('ord')),
]);

export const getOrderValue = (list, key, index) => {
  if (list && list[key]) {
    const orderValuePriority1 = path([key, SORT_KEY_PRIORITY_1], list);
    // Should not consider 0 as not defined
    if (typeof orderValuePriority1 !== 'undefined') {
      return orderValuePriority1;
    }
    const orderValuePriority2 = path([key, SORT_KEY_PRIORITY_2], list);
    // Should not consider 0 as not defined
    if (typeof orderValuePriority2 !== 'undefined') {
      return orderValuePriority2;
    }
  }
  return index;
};

export const getSortedListOfKeys = (list) => {
  try {
    if (!isEmptyData(list)) {
      const arr = Object.keys(list).map((
        key, index,
      ) => ({
        key,
        ord: getOrderValue(list, key, index),
      }));
      return sortArrByOrder(arr).map((item) => item.key);
    }
  } catch (e) {
    Logger.debug('NestedListItems.helper::getSortedListOfKeys', e);
  }
  return [];
};
