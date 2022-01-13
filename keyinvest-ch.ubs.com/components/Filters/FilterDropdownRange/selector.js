import { createSelector } from 'reselect';
import { produce } from 'immer';
import {
  getAppliedFilters,
  getData,
  notEmptyList,
  SUB_FILTER_TYPE_INPUT_TEXT,
} from '../Filters.helper';
import { filterListByInputValue } from './FilterDropdownRange.helper';

// eslint-disable-next-line import/prefer-default-export
export const dataSelector = createSelector(
  getData,
  getAppliedFilters,
  (data, appliedFilters) => produce(data, (filteredList) => {
    if (notEmptyList(appliedFilters) && notEmptyList(data)) {
      const inputValue = appliedFilters && appliedFilters[SUB_FILTER_TYPE_INPUT_TEXT];
      if (!inputValue) {
        return;
      }
      filteredList.list = filterListByInputValue(parseInt(inputValue, 10), data.list);
    }
  }),
);
