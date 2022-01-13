import { path } from 'ramda';
import Logger from '../../utils/logger';

const EMPTY_OBJ = {};
// eslint-disable-next-line import/prefer-default-export
export const dataUnderlyingTransform = (response) => {
  const transformedData = {};
  try {
    const underlyingsList = path(['underlyings', 'entries'], response);
    if (underlyingsList && Array.isArray(underlyingsList)) {
      underlyingsList.forEach((item) => {
        if (item.value) {
          transformedData[item.value] = item;
        }
      });
      return transformedData;
    }
    Logger.warn('UnderlyingBackendSearchableDropdownList::dataUnderlyingTransform failed: underlyingsList is not an array', response);
  } catch (e) {
    Logger.warn('UnderlyingBackendSearchableDropdownList::dataUnderlyingTransform failed:', e);
  }
  return EMPTY_OBJ;
};
