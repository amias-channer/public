import {
  filter, findIndex, pathOr, propEq,
} from 'ramda';
import { isEmptyData } from '../../../utils/utils';
import Logger from '../../../utils/logger';

export const getCheckboxInputs = (data) => pathOr([], ['checkboxGroup', 'input'], data);
export const getCheckboxIndexByValue = (value, list) => findIndex(propEq('value', value))(list);
const isChecked = (item) => item.selected === true;
export const getCheckedFilteredItems = (list) => filter(isChecked, list);

/**
 * Return any value from the provided list
 * but it should no be the same as the provided "excludedValue" parameter
 *
 * @param excludedValue
 * @param list
 * @returns {null|*}
 */
export const getAnotherValueFromList = (excludedValue, list) => {
  try {
    if (excludedValue && list && !isEmptyData(list)) {
      for (let i = 0; i < list.length; i += 1) {
        if (typeof list[i] === 'object' && list[i].visible && list[i].value !== excludedValue) {
          return list[i].value;
        }
      }
    }
  } catch (e) {
    Logger.warn('FilterCheckbox::getAnotherValueFromList', e);
  }
  return null;
};
