import { forEach, keys, path } from 'ramda';
import { isEmptyData } from '../../../utils/utils';
import { pathOrObject } from '../../../utils/typeChecker';

export const MY_TRENDRADAR_API_GET_ALL_URL = '/user/my-trend-radar';
export const areAllTrendRadarSubItemsEmpty = (data) => {
  let emptySubItems = true;
  if (pathOrObject(null, ['items'], data)) {
    forEach((sectionKey) => {
      if (!isEmptyData(path(['items', sectionKey, 'list'], data))) {
        emptySubItems = false;
      }
    }, keys(data.items));
  }
  return emptySubItems;
};
