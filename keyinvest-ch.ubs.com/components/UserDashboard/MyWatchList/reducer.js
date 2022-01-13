import { produce } from 'immer';
import {
  MY_WATCH_LIST_FETCH_DATA,
  MY_WATCH_LIST_GET_SEARCH_RESULTS,
  MY_WATCH_LIST_GET_SORTED_LIST,
  MY_WATCH_LIST_GOT_BACKEND_ERROR,
  MY_WATCH_LIST_GOT_DATA,
  MY_WATCH_LIST_GOT_SEARCH_RESULTS,
  MY_WATCH_LIST_GOT_SORTED_LIST, MY_WATCH_LIST_PRODUCT_REMOVED,
  MY_WATCH_LIST_PRODUCT_TILE_EDITABLE_FIELD_CHANGE,
  MY_WATCH_LIST_REMOVE_PRODUCT, MY_WATCH_LIST_RESET_FLYOUT_SEARCH_BOX_DATA,
  MY_WATCH_LIST_SET_DISPLAY_SEARCHBOX_FLYOUT,
  MY_WATCH_LIST_TOGGLE_NOTIFICATION_ALERT_POPUP,
  MY_WATCH_LIST_UNMOUNTED,
} from './actions';

export const initialState = {
  addProductPopup: {
    shouldDisplay: false,
    productIsin: null,
    productName: null,
  },
  flyoutSearchBox: {
    shouldDisplay: false,
  },
  watchlistSortedBy: null,
  watchlistSortDirection: null,
  notificationAlertPopup: {
    shouldDisplay: false,
  },
  isBackendError: null,
};

const myWatchListReducer = (state = initialState, action) => produce(state, (draft) => {
  switch (action.type) {
    case MY_WATCH_LIST_FETCH_DATA:
      draft.isLoading = true;
      break;
    case MY_WATCH_LIST_GOT_DATA:
      draft.isLoading = false;
      draft.data = action.data;
      draft.isBackendError = null;
      break;
    case MY_WATCH_LIST_GET_SEARCH_RESULTS:
      draft.isSearchLoading = true;
      break;
    case MY_WATCH_LIST_GOT_SEARCH_RESULTS:
      draft.isSearchLoading = false;
      draft.isBackendError = null;
      draft.searchData = action.data;
      break;
    case MY_WATCH_LIST_SET_DISPLAY_SEARCHBOX_FLYOUT:
      draft.flyoutSearchBox.shouldDisplay = action.status;
      break;
    case MY_WATCH_LIST_GET_SORTED_LIST:
      draft.isLoading = true;
      break;
    case MY_WATCH_LIST_REMOVE_PRODUCT:
    case MY_WATCH_LIST_PRODUCT_TILE_EDITABLE_FIELD_CHANGE:
      draft.isBackendError = null;
      draft.isLoading = true;
      break;
    case MY_WATCH_LIST_PRODUCT_REMOVED:
      draft.isLoading = false;
      break;
    case MY_WATCH_LIST_GOT_SORTED_LIST:
      draft.data = action.data;
      draft.watchlistSortedBy = action.sortBy;
      draft.watchlistSortDirection = action.sortDirection;
      draft.isLoading = false;
      draft.isBackendError = null;
      break;
    case MY_WATCH_LIST_TOGGLE_NOTIFICATION_ALERT_POPUP:
      draft.notificationAlertPopup.shouldDisplay = !draft.notificationAlertPopup.shouldDisplay;
      draft.notificationAlertPopup.productIsin = action.productIsin;
      break;
    case MY_WATCH_LIST_GOT_BACKEND_ERROR:
      draft.isBackendError = action.error;
      draft.isLoading = false;
      break;
    case MY_WATCH_LIST_UNMOUNTED:
      draft.addProductPopup = initialState.addProductPopup;
      draft.flyoutSearchBox = initialState.flyoutSearchBox;
      draft.watchlistSortedBy = initialState.watchlistSortedBy;
      draft.watchlistSortDirection = initialState.watchlistSortDirection;
      draft.notificationAlertPopup = initialState.notificationAlertPopup;
      draft.isBackendError = initialState.isBackendError;
      draft.data = {};
      draft.searchData = {};
      break;
    case MY_WATCH_LIST_RESET_FLYOUT_SEARCH_BOX_DATA:
      draft.searchData = {};
      break;
    default:
      break;
  }
});

export default myWatchListReducer;
