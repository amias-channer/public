import { produce } from 'immer';
import {
  MY_SEARCHES_CLEAR_SEARCH_NAME,
  MY_SEARCHES_ERROR,
  MY_SEARCHES_FAILURE_DISMISS,
  MY_SEARCHES_FETCH_DATA,
  MY_SEARCHES_GOT_DATA,
  MY_SEARCHES_GOT_REMOVE,
  MY_SEARCHES_GOT_SAVE,
  MY_SEARCHES_GOT_UPDATE_NAME,
  MY_SEARCHES_ON_SEARCH_NAME_CHANGE,
  MY_SEARCHES_REMOVE, MY_SEARCHES_SAVE,
  MY_SEARCHES_TOGGLE_SAVE_POPUP,
  MY_SEARCHES_UPDATE_NAME, MY_SEARCHES_WILL_UNMOUNT,
} from './actions';

export const initialState = {
  data: null,
  failure: null,
  isLoading: false,
  savePopup: {
    visible: false,
    data: null,
    filtersData: null,
    failure: null,
    isLoading: false,
    searchName: '',
  },
};

// eslint-disable-next-line consistent-return
const mySearchesReducer = (state = initialState, action = {}) => produce(state, (draft) => {
  switch (action.type) {
    case MY_SEARCHES_FETCH_DATA:
      draft.isLoading = true;
      break;
    case MY_SEARCHES_GOT_DATA:
      draft.isLoading = false;
      draft.data = action.data;
      if (action.failure) {
        draft.failure = action.failure;
      }
      break;
    case MY_SEARCHES_TOGGLE_SAVE_POPUP:
      draft.savePopup = {
        visible: action.visible,
        data: null,
        filtersData: action.filtersData,
        failure: null,
        isLoading: false,
      };
      break;
    case MY_SEARCHES_SAVE:
      draft.savePopup.isLoading = true;
      draft.savePopup.failure = null;
      draft.savePopup.success = null;
      break;
    case MY_SEARCHES_GOT_SAVE:
      draft.savePopup.isLoading = false;
      if (action.failure) {
        draft.savePopup.failure = action.failure;
      }
      if (action.success) {
        draft.savePopup.success = action.success;
      }
      break;
    case MY_SEARCHES_UPDATE_NAME:
    case MY_SEARCHES_REMOVE:
      draft.isLoading = true;
      draft.failure = null;
      break;
    case MY_SEARCHES_GOT_UPDATE_NAME:
    case MY_SEARCHES_GOT_REMOVE:
      draft.isLoading = false;
      if (action.failure) {
        draft.failure = action.failure;
      }
      break;
    case MY_SEARCHES_ON_SEARCH_NAME_CHANGE:
      draft.savePopup.searchName = action.updatedName;
      break;
    case MY_SEARCHES_CLEAR_SEARCH_NAME:
      draft.savePopup.searchName = '';
      break;
    case MY_SEARCHES_WILL_UNMOUNT:
      return initialState;

    case MY_SEARCHES_ERROR:
      draft.savePopup.failure = action.error;
      break;
    case MY_SEARCHES_FAILURE_DISMISS:
      draft.savePopup.failure = null;
      break;
    default:
      break;
  }
});

export default mySearchesReducer;
