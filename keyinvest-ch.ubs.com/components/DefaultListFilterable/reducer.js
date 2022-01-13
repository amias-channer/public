import { produce } from 'immer';
import {
  path, mergeLeft, assocPath,
} from 'ramda';
import {
  getActiveTabFromQueryParams,
} from './ProductFilters/ProductFilters.helper';
import {
  DEFAULT_LIST_FILTERABLE_FETCH_DATA,
  DEFAULT_LIST_FILTERABLE_FETCH_MORE_DATA,
  DEFAULT_LIST_FILTERABLE_FILTERS_FIRST_LEVEL_TOGGLE_TAB,
  DEFAULT_LIST_FILTERABLE_GOT_DATA,
  DEFAULT_LIST_FILTERABLE_GOT_MORE_DATA,
  DEFAULT_LIST_FILTERABLE_UPDATE_FILTER_LIST_ITEM,
  DEFAULT_LIST_FILTERABLE_WILL_UNMOUNT,
} from './actions';
import {
  applyAppendsFromResponseToStore,
  applyOverridesFromResponseToStore,
  updateAllSubLists,
} from './reducer.helper';

export const initialState = {};

const defaultListFilterableReducer = (state = initialState, action) => produce(state, (draft) => {
  switch (action.type) {
    case DEFAULT_LIST_FILTERABLE_FILTERS_FIRST_LEVEL_TOGGLE_TAB:
      if (!draft[action.uniqDefaultListId]) {
        draft[action.uniqDefaultListId] = {};
      }
      if (action.activeTab === draft[action.uniqDefaultListId].activeTab) {
        draft[action.uniqDefaultListId].activeTab = null;
      } else {
        draft[action.uniqDefaultListId].activeTab = action.activeTab;
      }
      draft[action.uniqDefaultListId].isLoading = true;
      break;
    case DEFAULT_LIST_FILTERABLE_FETCH_DATA:
      if (!draft[action.uniqDefaultListId]) {
        draft[action.uniqDefaultListId] = {};
      }
      draft[action.uniqDefaultListId].isLoading = true;
      break;

    case DEFAULT_LIST_FILTERABLE_GOT_DATA: {
      if (!draft[action.uniqDefaultListId]) {
        draft[action.uniqDefaultListId] = {};
      }
      draft[action.uniqDefaultListId].isLoading = false;
      draft[action.uniqDefaultListId].isLoadingMore = false;

      draft[action.uniqDefaultListId].data = action.data;

      draft[action.uniqDefaultListId].activeTab = getActiveTabFromQueryParams(
        draft[action.uniqDefaultListId].activeTab,
      );

      break;
    }

    case DEFAULT_LIST_FILTERABLE_FETCH_MORE_DATA:
      if (!draft[action.uniqDefaultListId]) {
        draft[action.uniqDefaultListId] = {};
      }
      draft[action.uniqDefaultListId].isLoadingMore = true;
      break;

    case DEFAULT_LIST_FILTERABLE_GOT_MORE_DATA: {
      const { uniqDefaultListId } = action;
      if (!draft[uniqDefaultListId]) {
        draft[uniqDefaultListId] = {};
      }
      draft[uniqDefaultListId].isLoading = false;
      draft[uniqDefaultListId].isLoadingMore = false;

      if (action.data) {
        // Updating the loadMore parameters for the next request
        draft[uniqDefaultListId] = applyOverridesFromResponseToStore(
          action.pathsToOverride, action, draft, uniqDefaultListId,
        );

        // Extending the list of rows with the new items
        draft[uniqDefaultListId] = applyAppendsFromResponseToStore(
          action.pathsOfListsToAppend, action, draft, uniqDefaultListId,
        );
      }
      break;
    }
    case DEFAULT_LIST_FILTERABLE_UPDATE_FILTER_LIST_ITEM: {
      const fullDataSource = [
        action.uniqDefaultListId,
        'data',
        ...action.dataSource,
        action.filterKey,
        action.listType,
        ...(action.innerPath ? action.innerPath : []),
        action.itemKey,
      ];

      const listItem = path(fullDataSource)(draft);
      if (listItem) {
        const newListItem = mergeLeft(action.itemValue, listItem);

        if (newListItem.list) {
          newListItem.list = updateAllSubLists(newListItem.list, action.itemValue);
        }

        const newDraft = assocPath(fullDataSource, newListItem, draft);

        return newDraft;
        // draft = assocPath(fullDataSource, newListItem, draft);

        /* const filterRootPath = [
          action.uniqDefaultListId,
          'data',
          ...action.dataSource,
          action.filterKey,
          //action.listType,
        ];

        const filter = path(filterRootPath)(draft);
        if (filter) {
          // return assocPath(filterRootPath, updateFullTree(filter), draft);
          if (action.childof) {
            updateStateForParentList(filter, action.childof);
          }
        }
        return newDraft; */
      }
      break;
    }
    case DEFAULT_LIST_FILTERABLE_WILL_UNMOUNT:
      if (draft[action.uniqDefaultListId]) {
        delete draft[action.uniqDefaultListId];
      }
      break;

    default:
      break;
  }
});

export default defaultListFilterableReducer;
