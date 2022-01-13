import { pathOr, keys } from 'ramda';
import {
  FILTER_LEVEL_SECOND,
  FILTER_LEVEL_THIRD,
  FIRST_LEVEL_FILTER_KEY,
} from './ProductFilters/ProductFilters.helper';
import {
  dispatchAnalyticsProductSearchTrack,
  getAnalyticsFirstLevelLabelByValueFromMapping,
  NETCENTRIC_INVESTMENT_PRODUCTS,
} from '../../analytics/Analytics.helper';
import Logger from '../../utils/logger';

export const UNDERLYINGS_FILTER_KEY = 'underlyings';
export const CURRENCIES_FILTER_KEY = 'currencies';
export const PRODUCT_TYPE_FILTER_KEY = 'productType';

export const getValuesLabelsByIds = (filterKey, ids, currentFilterLevel, filterData) => {
  if (ids && Array.isArray(ids)) {
    return ids.map((id) => pathOr(id, [currentFilterLevel, filterKey, 'list', id, 'label'])(filterData));
  }
  return [];
};
export const getActiveOptionsIdsByFilterKey = (filterKey, currentFilterLevel, filterData) => keys(pathOr({}, [currentFilterLevel, filterKey, 'active'], filterData));
export const getFilterLabel = (filterKey, currentFilterLevel, filterData) => pathOr(filterKey, [currentFilterLevel, filterKey, 'label'])(filterData);

/**
 * Try to find the First Level active tab from the filterData obj
 * @param filterData
 * @returns {null|string}
 */
export const getFirstLevelFilterFromFilterData = (filterData) => {
  try {
    if (filterData && filterData.firstLevel) {
      const firstLevel = pathOr({}, ['firstLevel', FIRST_LEVEL_FILTER_KEY], filterData);
      const [key, val] = Object.entries(firstLevel).find((obj) => obj[1].selected === true);
      return val.label || key;
    }
  } catch (e) {
    Logger.warn('ProductFiltersAnalytics::getFirstLevelFilterFromFilterData', e);
  }
  return null;
};

/**
 * Try to find the label(translated/mapped with analytics names)
 * of current active first level filter from
 * the updated query params object or the filterData
 *
 * @param updatedParams
 * @param filterData
 * @returns {null|string}
 */
export const getCurrentFirstLevelLabel = (
  updatedParams,
  filterData,
) => getAnalyticsFirstLevelLabelByValueFromMapping(
  (updatedParams && updatedParams[FIRST_LEVEL_FILTER_KEY])
  || getFirstLevelFilterFromFilterData(filterData),
);

/**
 * Try to get the list of currently selected items
 *
 * @param filterKey
 * @param filterLevel
 * @param updatedParams
 * @param filterData
 * @returns {string}
 */
export const getCurrentActiveListItemsForTracking = (
  filterKey,
  filterLevel,
  updatedParams,
  filterData,
) => {
  let selectedIds;
  // Try to find the active Ids in the updated query params (as object)
  if (updatedParams && updatedParams[filterKey]) {
    selectedIds = updatedParams[filterKey];
  } else {
    // If active Ids are not the new query params, try to gather them from the filterData
    selectedIds = getActiveOptionsIdsByFilterKey(
      filterKey,
      filterLevel,
      filterData,
    );
  }
  // Return a string with ',' separated labels
  return getValuesLabelsByIds(
    filterKey,
    selectedIds,
    filterLevel,
    filterData,
  ).join(', ');
};

/**
 * Try to get the list of currently selected Underlyings
 *
 * @param updatedParams
 * @param filterData
 * @returns {null|string}
 */
export const getCurrentUnderlyings = (
  updatedParams,
  filterData,
) => getCurrentActiveListItemsForTracking(
  UNDERLYINGS_FILTER_KEY, FILTER_LEVEL_SECOND, updatedParams, filterData,
);

/**
 * Try to get the list of currently selected Currencies
 *
 * @param updatedParams
 * @param filterData
 * @returns {null|string}
 */
export const getCurrentCurrencies = (
  updatedParams,
  filterData,
) => getCurrentActiveListItemsForTracking(
  CURRENCIES_FILTER_KEY, FILTER_LEVEL_SECOND, updatedParams, filterData,
);

/**
 * Get the label of a product type by value
 * @param productTypeValue
 * @param filterData
 * @returns {string}
 */
export const getProductTypeLabel = (productTypeValue, filterData) => {
  if (filterData) {
    const productTypeList = pathOr({}, [FILTER_LEVEL_SECOND, PRODUCT_TYPE_FILTER_KEY, 'list'], filterData);
    let label = productTypeValue;
    const findLabelByValueInNestedList = (list, value) => {
      if (typeof list === 'object' && !Array.isArray(list)) {
        const listKeys = Object.keys(list);
        for (let i = 0; i < listKeys.length; i += 1) {
          if (list[listKeys[i]] && list[listKeys[i]].value === value) {
            label = list[listKeys[i]].label || value;
            return;
          }
          if (list[listKeys[i]] && list[listKeys[i]].list) {
            findLabelByValueInNestedList(list[listKeys[i]].list, value);
          }
        }
      }
    };
    findLabelByValueInNestedList(productTypeList, productTypeValue);
    return label;
  }
  return productTypeValue;
};

/**
 * Try to get the current Product Type (group)
 *
 * @param updatedParams
 * @param filterData
 * @returns {null|string}
 */
export const getCurrentProductType = (
  updatedParams,
  filterData,
) => {
  if (updatedParams && updatedParams[PRODUCT_TYPE_FILTER_KEY]) {
    return getProductTypeLabel(updatedParams[PRODUCT_TYPE_FILTER_KEY], filterData);
  }
  return pathOr('', [FILTER_LEVEL_SECOND, PRODUCT_TYPE_FILTER_KEY, 'selected', 'label'], filterData);
};

/**
 * Return the product type if the first level filter is "Investment products"
 * @param updatedParams
 * @param filterData
 * @returns {string|null}
 */
export const getCurrentInvestmentType = (
  updatedParams,
  filterData,
) => {
  const firstLevelLabel = getCurrentFirstLevelLabel(updatedParams, filterData);
  if (firstLevelLabel === NETCENTRIC_INVESTMENT_PRODUCTS) {
    return getCurrentProductType(updatedParams, filterData);
  }
  return '';
};

export const getMaturityDateLabel = (slider, filterData) => {
  let label = '';
  if (slider && slider.sliderStart && slider.sliderEnd) {
    const list = pathOr([], [FILTER_LEVEL_THIRD, 'maturityDate', 'maturityDate', 'list'])(filterData);
    list.forEach((item) => {
      if (
        String(item.sliderStart) === String(slider.sliderStart)
        && String(item.sliderEnd) === String(slider.sliderEnd)
      ) {
        label = item.label;
      }
    });
  }
  return label;
};

export const formatFilterValues = (newFilterValues) => {
  if (Array.isArray(newFilterValues)) {
    return newFilterValues.join(', ');
  }
  if (typeof newFilterValues === 'object'
    && (newFilterValues.sliderStart || newFilterValues.sliderEnd)
  ) {
    return `Min:${newFilterValues.sliderStart}, Max:${newFilterValues.sliderEnd}`;
  }
  return newFilterValues;
};

export const trackProductListFilterUpdate = (
  filterKey,
  newFilterValues,
  currentFilterLevel,
  filterData,
  updatedFullParams,
) => {
  switch (filterKey) {
    case FIRST_LEVEL_FILTER_KEY:
      dispatchAnalyticsProductSearchTrack(
        '',
        '',
        '',
        '',
        getAnalyticsFirstLevelLabelByValueFromMapping(newFilterValues)
                        || getCurrentFirstLevelLabel(updatedFullParams, filterData),
        '',
        '',
      );
      break;
    case PRODUCT_TYPE_FILTER_KEY:
      dispatchAnalyticsProductSearchTrack(
        getCurrentUnderlyings(updatedFullParams, filterData),
        getFilterLabel(PRODUCT_TYPE_FILTER_KEY, FILTER_LEVEL_SECOND, filterData),
        getProductTypeLabel(newFilterValues, filterData)
                      || getCurrentProductType(updatedFullParams, filterData),
        getProductTypeLabel(newFilterValues, filterData)
                      || getCurrentProductType(updatedFullParams, filterData),
        getCurrentFirstLevelLabel(updatedFullParams, filterData),
        getCurrentInvestmentType(updatedFullParams, filterData),
        getCurrentCurrencies(updatedFullParams, filterData),
      );
      break;
    case UNDERLYINGS_FILTER_KEY:
    case CURRENCIES_FILTER_KEY:
      dispatchAnalyticsProductSearchTrack(
        getCurrentUnderlyings(updatedFullParams, filterData),
        getFilterLabel(filterKey, FILTER_LEVEL_SECOND, filterData),
        getCurrentActiveListItemsForTracking(
          filterKey, FILTER_LEVEL_SECOND, updatedFullParams, filterData,
        ),
        getCurrentProductType(updatedFullParams, filterData),
        getCurrentFirstLevelLabel(updatedFullParams, filterData),
        getCurrentInvestmentType(updatedFullParams, filterData),
        getCurrentCurrencies(updatedFullParams, filterData),
      );
      break;
    default:
      if (filterData
        && filterData[FILTER_LEVEL_THIRD]
        && Object.keys(filterData[FILTER_LEVEL_THIRD]).indexOf(filterKey) >= 0
      ) {
        dispatchAnalyticsProductSearchTrack(
          getCurrentUnderlyings(updatedFullParams, filterData),
          getFilterLabel(filterKey, FILTER_LEVEL_THIRD, filterData),
          formatFilterValues(newFilterValues),
          getCurrentProductType(updatedFullParams, filterData),
          getCurrentFirstLevelLabel(updatedFullParams, filterData),
          getCurrentInvestmentType(updatedFullParams, filterData),
          getCurrentCurrencies(updatedFullParams, filterData),
        );
      }
      break;
  }
};
