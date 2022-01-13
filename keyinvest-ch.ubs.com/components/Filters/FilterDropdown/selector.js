import { createSelector } from 'reselect';
import { pathOr } from 'ramda';
import { produce } from 'immer';
import {
  getAppliedFilters,
  notEmptyList,
  SUB_FILTER_TYPE_INPUT_TEXT,
} from '../Filters.helper';
import { filterListByInputText } from './FilterDropdown.helper';

const EMPTY_OBJ = {};
export const getData = (state, props) => pathOr(EMPTY_OBJ, ['data'], props);

export const dataSelector = createSelector(
  getData,
  getAppliedFilters,
  (data, appliedFilters) => produce(data, (filteredList) => {
    if (notEmptyList(appliedFilters) && notEmptyList(data)) {
      const searchText = appliedFilters && appliedFilters[SUB_FILTER_TYPE_INPUT_TEXT];
      filteredList.list = filterListByInputText(searchText, filteredList.list);
    }
  }),
);
