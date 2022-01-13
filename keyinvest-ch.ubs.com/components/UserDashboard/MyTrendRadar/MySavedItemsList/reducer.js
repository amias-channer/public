import { produce } from 'immer';
import { mergeRight, pathOr } from 'ramda';
import {
  MY_SAVED_ITEMS_LIST_FETCH_DATA, MY_SAVED_ITEMS_LIST_FETCH_FULL_DATA,
  MY_SAVED_ITEMS_LIST_GOT_DATA,
  MY_SAVED_ITEMS_LIST_GOT_FULL_DATA,
  MY_SAVED_ITEMS_LIST_GOT_REMOVE_ITEM,
  MY_SAVED_ITEMS_LIST_REMOVE_ITEM,
  MY_SAVED_ITEMS_LIST_WILL_UNMOUNT,
} from './actions';

export const initialState = {
  isLoading: false,
  failure: null,
  items: {},
};

// eslint-disable-next-line consistent-return
const mySavedItemsListReducer = (state = initialState, action = {}) => produce(state, (draft) => {
  switch (action.type) {
    case MY_SAVED_ITEMS_LIST_FETCH_DATA:
    case MY_SAVED_ITEMS_LIST_REMOVE_ITEM:
      if (!draft.items[action.uniqId]) {
        draft.items[action.uniqId] = {};
      }
      draft.items[action.uniqId].isLoading = true;
      draft.items[action.uniqId].failure = null;
      break;
    case MY_SAVED_ITEMS_LIST_GOT_DATA:
      if (!draft.items[action.uniqId]) {
        draft.items[action.uniqId] = {};
      }
      draft.items[action.uniqId].isLoading = false;
      draft.items[action.uniqId] = mergeRight(draft.items[action.uniqId], pathOr({}, ['payload', 'data'], action));
      if (action.failure) {
        draft.items[action.uniqId].failure = action.failure;
      }
      break;
    case MY_SAVED_ITEMS_LIST_FETCH_FULL_DATA:
      draft.isLoading = true;
      draft.failure = null;
      draft.items = {};
      break;
    case MY_SAVED_ITEMS_LIST_GOT_FULL_DATA:
      draft.isLoading = false;
      if (action.failure) {
        draft.failure = action.failure;
      }
      draft.items = mergeRight(draft.items || {}, pathOr({}, ['payload', 'data'], action));
      break;
    case MY_SAVED_ITEMS_LIST_GOT_REMOVE_ITEM:
      if (!draft.items[action.uniqId]) {
        draft.items[action.uniqId] = {};
      }
      draft.items[action.uniqId].isLoading = false;
      if (action.failure) {
        draft.items[action.uniqId].failure = action.failure;
      }
      break;
    case MY_SAVED_ITEMS_LIST_WILL_UNMOUNT:
      if (action.uniqId && draft.items[action.uniqId]) {
        delete draft.items[action.uniqId];
      }
      break;

    default:
      break;
  }
});

export default mySavedItemsListReducer;
