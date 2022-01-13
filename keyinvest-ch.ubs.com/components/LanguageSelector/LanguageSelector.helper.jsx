import { replace } from 'ramda';
import {
  STATE_NAME_PRODUCT_DETAIL,
  STATE_NAME_TREND_RADAR_DETAILS_PAGE,
} from '../../main/constants';
import { stringifyParams } from '../../utils/utils';

// eslint-disable-next-line import/prefer-default-export
export const generateLanguageChangeUrlByLocale = (
  localeToUrl, currentStateName, location, additionalNavigationData,
) => {
  let path = `${localeToUrl}languageChange?`;
  if (currentStateName) {
    path += `stateName=${currentStateName}&`;
  }
  if (location && location.search) {
    const searchParams = location.search.indexOf('?') === 0 ? replace('?', '', location.search) : location.search;
    path += searchParams;
  }
  if (currentStateName === STATE_NAME_PRODUCT_DETAIL
    || currentStateName === STATE_NAME_TREND_RADAR_DETAILS_PAGE) {
    if (additionalNavigationData) {
      return path + stringifyParams(additionalNavigationData);
    }
  }

  return path;
};
