import { createSelector } from 'reselect';
import { pathOr } from 'ramda';
import { produce } from 'immer';
import {
  SUB_FILTER_TYPE_CHARACTER, filterListByCharacter, filterListByInputText,
  getFilterListType,
} from './FilterUnderlyingsDropdown.helper';
import { notEmptyList, SUB_FILTER_TYPE_INPUT_TEXT } from '../Filters.helper';

const EMPTY_OBJ = {};
export const getData = (state, props) => props.data;
export const getAppliedFilters = (state, props) => pathOr(EMPTY_OBJ, ['appliedListFilters', props.uniqDefaultListId, props.filterKey])(state);

const dataSelector = createSelector(
  getData,
  getAppliedFilters,
  (data, appliedFilters) => produce(data, (filteredListData) => {
    const filterListType = getFilterListType(appliedFilters);
    if (notEmptyList(appliedFilters) && notEmptyList(filteredListData)) {
      Object.keys(appliedFilters).forEach((filterName) => {
        switch (filterName) {
          case SUB_FILTER_TYPE_CHARACTER:
            filteredListData[filterListType] = filterListByCharacter(
              appliedFilters[filterName],
              filteredListData[filterListType],
            );
            break;
          case SUB_FILTER_TYPE_INPUT_TEXT:
            filteredListData[filterListType] = filterListByInputText(
              appliedFilters[filterName],
              filteredListData[filterListType],
            );
            break;
          default:
            break;
        }
      });
    }

    return filteredListData;
  }),
);

export default dataSelector;
