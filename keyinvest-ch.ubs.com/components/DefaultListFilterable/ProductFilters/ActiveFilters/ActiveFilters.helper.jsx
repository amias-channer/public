import { pathOr, path, concat } from 'ramda';
import {
  FILTER_LEVEL_SECOND,
  FILTER_LEVEL_THIRD,
} from '../ProductFilters.helper';
import { getProductFilterComponentByKey } from '../../../Filters/productFiltersConfig';
import FilterRange from '../../../Filters/FilterRange';
import FilterMonthsPicker from '../../../Filters/FilterMonthsPicker';
import FilterDatesPicker from '../../../Filters/FilterDatesPicker';
import { momentFromTimestamp } from '../../../Filters/Filters.helper';
import FilterCheckbox from '../../../Filters/FilterCheckbox';
import Logger from '../../../../utils/logger';

export const getActiveValues = (filterItem, filterKey, level) => {
  try {
    const result = [];
    const filterType = getProductFilterComponentByKey(filterKey);
    switch (filterType) {
      case FilterRange: {
        const currentStartValue = path(['slider', 'sliderStart'], filterItem);
        const currentEndValue = path(['slider', 'sliderEnd'], filterItem);
        const defaultStartValue = path(['slider', 'min'], filterItem);
        const defaultEndValue = path(['slider', 'max'], filterItem);
        if (currentStartValue !== defaultStartValue) {
          result.push({
            label: `${filterItem.label} Min: ${currentStartValue}`,
            value: currentStartValue,
            filterKey: `${filterKey}`,
            filterSaveKey: `${filterKey}-start`,
            filterLevel: level,
            additionalData: {
              minValue: defaultStartValue,
              maxValue: defaultEndValue,
              currentEndValue,
              type: 'start',
            },
          });
        }
        if (currentEndValue !== defaultEndValue) {
          result.push({
            label: `${filterItem.label} Max: ${currentEndValue}`,
            value: currentEndValue,
            filterKey: `${filterKey}`,
            filterSaveKey: `${filterKey}-end`,
            filterLevel: level,
            additionalData: {
              minValue: defaultStartValue,
              maxValue: defaultEndValue,
              currentStartValue,
              type: 'end',
            },
          });
        }
        return result;
      }
      case FilterCheckbox: {
        pathOr([], ['checkboxGroup', 'input'], filterItem).forEach((option) => {
          if (option && option.selected) {
            result.push({
              label: `${filterItem.label}: ${option.label}`,
              value: option.value,
              filterKey,
              filterLevel: level,
            });
          }
        });
        return result;
      }
      case FilterMonthsPicker:
        return pathOr([], ['selected'], filterItem).map((value) => ({
          label: `${filterItem.label}: ${filterItem.openEndDate === value ? 'Open End' : value}`,
          value,
          filterKey,
          filterLevel: level,
        }));
      case FilterDatesPicker:
        return pathOr([], ['selected'], filterItem).map((value) => ({
          label: `${filterItem.label}: ${filterItem.openEndDate === value ? 'Open End' : momentFromTimestamp(value).format('DD.MM.YYYY')}`,
          value,
          filterKey,
          filterLevel: level,
        }));
      default:
        return Object.keys(pathOr({}, ['active'], filterItem)).map((valueKey) => ({
          label: (level === FILTER_LEVEL_THIRD ? `${filterItem.label}: ` : '') + pathOr('', ['active', valueKey, 'label'], filterItem),
          pushValue: path(['active', valueKey, 'pushValue'], filterItem),
          value: valueKey,
          filterKey,
          filterLevel: level,
        }));
    }
  } catch (e) {
    Logger.warn('Failed to getActiveValues', filterKey, filterItem, e);
    return [];
  }
};

export const getFiltersActiveTags = (filterData) => {
  try {
    let resultList = [];
    const levels = [
      FILTER_LEVEL_SECOND,
      FILTER_LEVEL_THIRD,
    ];
    if (filterData) {
      levels.forEach((level) => {
        const filtersInLevel = filterData[level];
        if (filtersInLevel) {
          Object.keys(filtersInLevel).forEach((filterKey) => {
            const activeTags = getActiveValues(filtersInLevel[filterKey], filterKey, level);
            if (activeTags) {
              resultList = concat(resultList, activeTags);
            }
          });
        }
      });
    }
    return resultList;
  } catch (e) {
    Logger.warn('Failed to getFiltersActiveTags', filterData, e);
    return [];
  }
};

export const getFiltersActiveTagsToSave = (filterData) => {
  try {
    const allActiveTags = getFiltersActiveTags(filterData);
    return allActiveTags.map((tag) => ({
      key: tag.filterSaveKey || tag.filterKey,
      value: tag.value,
    }));
  } catch (e) {
    Logger.warn('Failed to getFiltersActiveTags', filterData, e);
    return [];
  }
};
