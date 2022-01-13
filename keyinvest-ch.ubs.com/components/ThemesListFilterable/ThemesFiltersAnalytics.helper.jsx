import {
  dispatchAnalyticsThemesSearchTrack,
} from '../../analytics/Analytics.helper';
import {
  formatFilterValues,
  getFilterLabel, getValuesLabelsByIds,
} from '../DefaultListFilterable/ProductFiltersAnalytics.helper';
import { FILTER_LEVEL_SECOND } from '../DefaultListFilterable/ProductFilters/ProductFilters.helper';

// eslint-disable-next-line import/prefer-default-export
export const trackThemesFilterUpdate = (
  filterKey,
  newFilterValues,
  currentFilterLevel,
  filterData,
) => {
  switch (filterKey) {
    case 'currency':
      dispatchAnalyticsThemesSearchTrack(
        getFilterLabel(filterKey, currentFilterLevel, filterData),
        formatFilterValues(
          getValuesLabelsByIds(
            filterKey, newFilterValues, FILTER_LEVEL_SECOND, filterData,
          ),
        ),
        '',
        '',
        '',
      );
      break;
    case 'maturityType':
      dispatchAnalyticsThemesSearchTrack(
        getFilterLabel(filterKey, currentFilterLevel, filterData),
        '',
        formatFilterValues(
          getValuesLabelsByIds(
            filterKey, newFilterValues, FILTER_LEVEL_SECOND, filterData,
          ),
        ),
        '',
        '',
      );
      break;
    case 'tag':
      dispatchAnalyticsThemesSearchTrack(
        getFilterLabel(filterKey, currentFilterLevel, filterData),
        '',
        '',
        formatFilterValues(
          getValuesLabelsByIds(
            filterKey, newFilterValues, FILTER_LEVEL_SECOND, filterData,
          ),
        ),
        '',
      );
      break;
    case 'region':
      dispatchAnalyticsThemesSearchTrack(
        getFilterLabel(filterKey, currentFilterLevel, filterData),
        '',
        '',
        '',
        formatFilterValues(
          getValuesLabelsByIds(
            filterKey, newFilterValues, FILTER_LEVEL_SECOND, filterData,
          ),
        ),
      );
      break;
    default:
      break;
  }
};
