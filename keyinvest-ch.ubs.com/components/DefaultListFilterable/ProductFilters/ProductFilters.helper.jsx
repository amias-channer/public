import { parseUrl } from 'query-string';

import {
  mergeRight,
  clone,
  without,
  indexOf,
  intersection,
} from 'ramda';
import Logger from '../../../utils/logger';
import getAppConfig from '../../../main/AppConfig';

const SITE_VARIANT_APPLICATION_CH = 'ch';
const SITE_VARIANT_APPLICATION_DE = 'de';

export const FILTER_LEVEL_FIRST = 'firstLevel';
export const FILTER_LEVEL_SECOND = 'secondLevel';
export const FILTER_LEVEL_THIRD = 'thirdLevel';
export const FILTER_TAB_IN_SUBSCRIPTION = 'inSubscription';
export const FILTER_TAB_LEVERAGE_PRODUCTS = 'currentLeverageProducts';
export const FILTER_TAB_INVESTMENT_PRODUCTS = 'currentInvestmentProducts';
export const FIRST_LEVEL_FILTER_KEY = 'firstLevelFilters';
// Array of filter keys having the label 'Typ',
// these keys are different depending on the product type
export const TYP_FILTER_KEYS = ['formattedDirection', 'direction', 'instrumentType'];
export const TRADING_PLACE_FILTER_KEYS = ['tradingPlace'];

const DE_FILTER_TAB_INVESTMENT_PRODUCTS = 'investmentproducts';
const DE_FILTER_TAB_LEVERAGE_PRODUCTS = 'leverageproducts';
const CH_FILTER_TAB_INVESTMENT_PRODUCTS = 'svsp1investmentproducts';
const CH_FILTER_TAB_LEVERAGE_PRODUCTS = 'svsp2leverageproducts';

export const isInSubscriptionFilterEnabled = () => {
  const appConfig = getAppConfig();
  return appConfig.application !== SITE_VARIANT_APPLICATION_DE;
};

export const GET_FILTER_TAB_LEVERAGE_PRODUCTS = () => {
  const appConfig = getAppConfig();
  if (appConfig.application === SITE_VARIANT_APPLICATION_CH) {
    return CH_FILTER_TAB_LEVERAGE_PRODUCTS;
  }
  return DE_FILTER_TAB_LEVERAGE_PRODUCTS;
};

export const GET_FILTER_TAB_INVESTMENT_PRODUCTS = () => {
  const appConfig = getAppConfig();
  if (appConfig.application === SITE_VARIANT_APPLICATION_CH) {
    return CH_FILTER_TAB_INVESTMENT_PRODUCTS;
  }
  return DE_FILTER_TAB_INVESTMENT_PRODUCTS;
};

export const GET_FIRST_LEVEL_FILTER_TAB_MAPPING = () => ({
  [FILTER_TAB_IN_SUBSCRIPTION]: 'inSubscription',
  [GET_FILTER_TAB_LEVERAGE_PRODUCTS()]: FILTER_TAB_LEVERAGE_PRODUCTS,
  [GET_FILTER_TAB_INVESTMENT_PRODUCTS()]: FILTER_TAB_INVESTMENT_PRODUCTS,
});

/**
 * Native javascript to get current query params as string
 * @return {string}
 */
export const getObjFromQueryParams = (options = { arrayFormat: 'bracket' }) => {
  try {
    const parsedParams = parseUrl(window.location.search, options).query;
    Logger.debug('FILTER_HELPER', 'Reading current window.location.search', parsedParams);
    return parsedParams;
  } catch (e) {
    Logger.debug('FILTER_HELPER', window.location.search, e);
  }
  return {};
};

export const getSliderFilterValues = (filterKey, data) => {
  const result = {};
  if (filterKey && data) {
    if (typeof data.sliderStart !== 'undefined' && data.sliderStart !== null) {
      result[`${filterKey}-start`] = data.sliderStart;
    }
    if (typeof data.sliderEnd !== 'undefined' && data.sliderEnd !== null) {
      result[`${filterKey}-end`] = data.sliderEnd;
    }
  }
  return result;
};

export const removeQueryParamsByKeysForFilterLevel = (queryParameters, filtersData, level) => {
  const queryParams = clone(queryParameters);
  if (filtersData && filtersData[level]) {
    const queryParamKeys = Object.keys(queryParams);
    Object.keys(filtersData[level]).forEach((filterLevelKey) => {
      queryParamKeys.forEach((queryParamKey) => {
        if (queryParamKey.indexOf(filterLevelKey) === 0) {
          delete queryParams[queryParamKey];
        }
      });
    });
  }
  return queryParams;
};
/**
 * Prepare the Updated Browser Url Query Params
 *
 * @param filterKey
 * @param data
 * @param currentFilterLevel
 * @param filtersData
 * @param independentLevels - Should clear sub levels when a upper level filter was changed
 * @returns {{}|null}
 */
export const getUpdatedBrowserUrlQueryParams = (
  filterKey, data, currentFilterLevel, filtersData, independentLevels = false,
) => {
  let currentQueryParamsObj = getObjFromQueryParams();
  Logger.info('Current Query Params:', currentQueryParamsObj);
  if (filterKey && data !== undefined) {
    if (filterKey === FIRST_LEVEL_FILTER_KEY && typeof data === 'string' && !independentLevels) {
      // Clear all previous filters in the URL and set only first level
      return { [FIRST_LEVEL_FILTER_KEY]: data };
    }
    if (currentFilterLevel === FILTER_LEVEL_SECOND && !independentLevels) {
      Logger.info('Should clear all third level  filters', filterKey, data, currentFilterLevel, filtersData);
      currentQueryParamsObj = removeQueryParamsByKeysForFilterLevel(
        currentQueryParamsObj, filtersData, FILTER_LEVEL_THIRD,
      );
    }
    if (!Array.isArray(data) && typeof data === 'object') {
      // Range and Date filters
      return mergeRight(currentQueryParamsObj, getSliderFilterValues(filterKey, data));
    }
    // All other filters
    return mergeRight(currentQueryParamsObj, { [filterKey]: data });
  }
  return null;
};

export const isQueryParamContainsFirstLevelFilter = (
  queryParams,
) => !!(queryParams && queryParams[FIRST_LEVEL_FILTER_KEY]);

export const isQueryParamFirstLevelFilterInSubscription = (queryParams) => (
  queryParams[FIRST_LEVEL_FILTER_KEY] === FILTER_TAB_IN_SUBSCRIPTION
);

export const isQueryParamFirstLevelFilterLeverageProducts = (queryParams) => (
  queryParams[FIRST_LEVEL_FILTER_KEY] === FILTER_TAB_LEVERAGE_PRODUCTS
);

export const isQueryParamFirstLevelFilterInvestmentProducts = (queryParams) => (
  queryParams[FIRST_LEVEL_FILTER_KEY] === FILTER_TAB_INVESTMENT_PRODUCTS
);

/**
 * Should decide which activeTab based on Query Params (if available)
 * @param currentActiveTab
 * @returns {string}
 */
export const getActiveTabFromQueryParams = (currentActiveTab) => {
  // Setting a default tab open if GOT DATA and no activeTab
  const parsedQueryParams = getObjFromQueryParams();
  if (
    !currentActiveTab
    && isQueryParamContainsFirstLevelFilter(parsedQueryParams)
  ) {
    if (isQueryParamFirstLevelFilterInSubscription(parsedQueryParams)) {
      return FILTER_TAB_IN_SUBSCRIPTION;
    }

    if (isQueryParamFirstLevelFilterLeverageProducts(parsedQueryParams)) {
      return GET_FILTER_TAB_LEVERAGE_PRODUCTS();
    }

    if (isQueryParamFirstLevelFilterInvestmentProducts(parsedQueryParams)) {
      return GET_FILTER_TAB_INVESTMENT_PRODUCTS();
    }

    return parsedQueryParams[FIRST_LEVEL_FILTER_KEY];
  }

  if (!currentActiveTab) {
    return GET_FILTER_TAB_LEVERAGE_PRODUCTS();
  }

  return currentActiveTab;
};

export const getFilterSpecificClassNames = (filterKey, defaultClassNames) => {
  if (indexOf(filterKey, TYP_FILTER_KEYS) > -1) {
    return 'col-auto';
  }
  return defaultClassNames;
};

export const getFilterKeys = (data) => (data && Object.keys(data)) || [];

export const getFilterKeysWithoutLastRowFilters = (
  filterKeys,
  keysToOmit,
) => without(keysToOmit, filterKeys);

export const getFilterKeysForLastRowToRender = (
  filterKeys,
  lastRowFilterKeys,
) => intersection(filterKeys, lastRowFilterKeys);

export const getLastRowFilterKeys = () => [...TYP_FILTER_KEYS, ...TRADING_PLACE_FILTER_KEYS];

export const getFilterClassNames = (innerFilterClassNames, level) => {
  let filterClassNames = 'col-12 col-md-6 col-lg-3';
  if (innerFilterClassNames) {
    filterClassNames = innerFilterClassNames;
  } else if (level === FILTER_LEVEL_SECOND) {
    filterClassNames = 'col-12 col-md-6 col-lg-4';
  }
  return filterClassNames;
};
