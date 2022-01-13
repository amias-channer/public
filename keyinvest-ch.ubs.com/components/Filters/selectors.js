import { createSelector } from 'reselect';
import { produce } from 'immer';
import {
  filterListByInputText,
  getAppliedFilters,
  getData,
  notEmptyList,
  SUB_FILTER_TYPE_INPUT_TEXT,
} from './Filters.helper';

// eslint-disable-next-line import/prefer-default-export
export const nestedListFilterDataSelector = createSelector(
  getData,
  getAppliedFilters,
  (data, appliedFilters) => produce(data, (draft) => {
    if (notEmptyList(appliedFilters) && notEmptyList(data)) {
      const searchText = appliedFilters && appliedFilters[SUB_FILTER_TYPE_INPUT_TEXT];

      draft.list = filterListByInputText(searchText, draft.list);
    }
  }),
);
