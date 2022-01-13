import {
  dispatchAnalyticsYieldSearchTrack,
} from '../../analytics/Analytics.helper';
import {
  formatFilterValues,
  getFilterLabel,
  getValuesLabelsByIds,
} from '../DefaultListFilterable/ProductFiltersAnalytics.helper';
import { FILTER_LEVEL_SECOND } from '../DefaultListFilterable/ProductFilters/ProductFilters.helper';

// eslint-disable-next-line import/prefer-default-export
export const trackYieldFilterUpdate = (
  filterKey,
  newFilterValues,
  currentFilterLevel,
  filterData,
) => {
  switch (filterKey) {
    case 'sideways_return':
      dispatchAnalyticsYieldSearchTrack(
        '',
        getFilterLabel(filterKey, currentFilterLevel, filterData),
        '',
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
    case 'distance2Barrier':
      dispatchAnalyticsYieldSearchTrack(
        '',
        getFilterLabel(filterKey, currentFilterLevel, filterData),
        '',
        '',
        formatFilterValues(
          getValuesLabelsByIds(
            filterKey, [newFilterValues], FILTER_LEVEL_SECOND, filterData,
          ),
        ),
        '',
        '',
      );
      break;
    case 'underlyings':
      dispatchAnalyticsYieldSearchTrack(
        formatFilterValues(
          getValuesLabelsByIds(
            filterKey, newFilterValues, FILTER_LEVEL_SECOND, filterData,
          ),
        ),
        getFilterLabel(filterKey, currentFilterLevel, filterData),
        '',
        '',
        '',
        '',
        '',
      );
      break;
    case 'currencies':
      dispatchAnalyticsYieldSearchTrack(
        '',
        getFilterLabel(filterKey, currentFilterLevel, filterData),
        formatFilterValues(
          getValuesLabelsByIds(
            filterKey, newFilterValues, FILTER_LEVEL_SECOND, filterData,
          ),
        ),
        '',
        '',
        '',
        '',
      );
      break;
    case 'underlyingType':
      dispatchAnalyticsYieldSearchTrack(
        '',
        getFilterLabel(filterKey, currentFilterLevel, filterData),
        '',
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
    case 'brcCategory':
      dispatchAnalyticsYieldSearchTrack(
        '',
        getFilterLabel(filterKey, currentFilterLevel, filterData),
        '',
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
