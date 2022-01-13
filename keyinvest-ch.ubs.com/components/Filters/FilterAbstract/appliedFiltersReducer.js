import { produce } from 'immer';
import { mergeLeft } from 'ramda';
import {
  FILTER_ABSTRACT_RESET_ALL_LIST_FILTERS,
  FILTER_ABSTRACT_SET_APPLIED_FILTER,
} from './actions';


const INITIAL_STATE = {};

const appliedFiltersReducer = produce((draft = INITIAL_STATE, action) => {
  switch (action.type) {
    case FILTER_ABSTRACT_SET_APPLIED_FILTER:
      if (action.uniqDefaultListId && action.filterKey
        && action.appliedFilterName) {
        if (draft[action.uniqDefaultListId]) {
          const sourceData = { [action.appliedFilterName]: action.appliedFilterValue };
          // mergeLeft merges source object to destination object,
          // the first parameter (left) gets merged into second parameter (right)
          // eslint-disable-next-line max-len
          draft[action.uniqDefaultListId][action.filterKey] = mergeLeft(sourceData, draft[action.uniqDefaultListId][action.filterKey]);
          break;
        }

        // eslint-disable-next-line max-len
        draft[action.uniqDefaultListId] = { [action.filterKey]: { [action.appliedFilterName]: action.appliedFilterValue } };
      }
      break;
    case FILTER_ABSTRACT_RESET_ALL_LIST_FILTERS:
      if (action.uniqDefaultListId && draft[action.uniqDefaultListId]) {
        delete draft[action.uniqDefaultListId];
      }
      break;
    default:
      break;
  }
  return draft;
});

export default appliedFiltersReducer;
