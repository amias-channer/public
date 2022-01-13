export const MY_WATCH_LIST_FETCH_DATA = 'MyWatchList/MY_WATCH_LIST_FETCH_DATA';
export const MY_WATCH_LIST_GOT_DATA = 'MyWatchList/MY_WATCH_LIST_GOT_DATA';
export const MY_WATCH_LIST_GET_SEARCH_RESULTS = 'MyWatchList/USER_DASHBOARD_PAGE_GET_SEARCH_RESULTS';
export const MY_WATCH_LIST_GOT_SEARCH_RESULTS = 'MyWatchList/USER_DASHBOARD_PAGE_GOT_SEARCH_RESULTS';
export const MY_WATCH_LIST_REMOVE_PRODUCT = 'MyWatchList/MY_WATCH_LIST_REMOVE_PRODUCT';
export const MY_WATCH_LIST_PRODUCT_REMOVED = 'MyWatchList/MY_WATCH_LIST_PRODUCT_REMOVED';
export const MY_WATCH_LIST_RESET_ADD_PRODUCT_POPUP = 'MyWatchList/MY_WATCH_LIST_RESET_ADD_PRODUCT_POPUP';
export const MY_WATCH_LIST_SET_DISPLAY_SEARCHBOX_FLYOUT = 'MyWatchList/MY_WATCH_LIST_SET_DISPLAY_SEARCHBOX_FLYOUT';
export const MY_WATCH_LIST_RESET_FLYOUT_SEARCH_BOX_DATA = 'MyWatchList/MY_WATCH_LIST_RESET_FLYOUT_SEARCH_BOX_DATA';
export const MY_WATCH_LIST_GET_SORTED_LIST = 'MyWatchList/MY_WATCH_LIST_GET_SORTED_LIST';
export const MY_WATCH_LIST_GOT_SORTED_LIST = 'MyWatchList/MY_WATCH_LIST_GOT_SORTED_LIST';
export const MY_WATCH_LIST_TOGGLE_NOTIFICATION_ALERT_POPUP = 'MyWatchList/MY_WATCH_LIST_TOGGLE_NOTIFICATION_ALERT_POPUP';
export const MY_WATCH_LIST_PRODUCT_TILE_SET_NOTIFICATION_ALERT = 'MyWatchList/MY_WATCH_LIST_PRODUCT_TILE_SET_NOTIFICATION_ALERT';
export const MY_WATCH_LIST_GOT_BACKEND_ERROR = 'MyWatchList/MY_WATCH_LIST_GOT_BACKEND_ERROR';
export const MY_WATCH_LIST_UNMOUNTED = 'MyWatchList/MY_WATCH_LIST_UNMOUNTED';
export const MY_WATCH_LIST_PRODUCT_TILE_EDITABLE_FIELD_CHANGE = 'MyWatchList/MY_WATCH_LIST_PRODUCT_TILE_EDITABLE_FIELD_CHANGE';

export function myWatchListFetchData(url) {
  return {
    type: MY_WATCH_LIST_FETCH_DATA,
    url,
  };
}


export function myWatchListGotData(data) {
  return {
    type: MY_WATCH_LIST_GOT_DATA,
    data,
  };
}

export function myWatchListGetSearchResults(url, searchText) {
  return {
    type: MY_WATCH_LIST_GET_SEARCH_RESULTS,
    url,
    searchText,
  };
}

export function myWatchListGotSearchResults(data) {
  return {
    type: MY_WATCH_LIST_GOT_SEARCH_RESULTS,
    data,
  };
}

export function myWatchListRemoveProduct(url, onProductRemoveSuccessCallback) {
  return {
    type: MY_WATCH_LIST_REMOVE_PRODUCT,
    url,
    onProductRemoveSuccessCallback,
  };
}

export function myWatchListProductRemoved(data) {
  return {
    type: MY_WATCH_LIST_PRODUCT_REMOVED,
    data,
  };
}

export function myWatchListResetAddProductPopup() {
  return {
    type: MY_WATCH_LIST_RESET_ADD_PRODUCT_POPUP,
  };
}

export function myWatchListSetDisplaySearchboxFlyout(status) {
  return {
    type: MY_WATCH_LIST_SET_DISPLAY_SEARCHBOX_FLYOUT,
    status,
  };
}

export function myWatchListResetFlyoutSearchBoxData() {
  return {
    type: MY_WATCH_LIST_RESET_FLYOUT_SEARCH_BOX_DATA,
  };
}

export function myWatchListGetSortedList(url, sortBy, sortDirection) {
  return {
    type: MY_WATCH_LIST_GET_SORTED_LIST,
    url,
    sortBy,
    sortDirection,
  };
}

export function myWatchListGotSortedList(data, sortBy, sortDirection) {
  return {
    type: MY_WATCH_LIST_GOT_SORTED_LIST,
    data,
    sortBy,
    sortDirection,
  };
}

export function myWatchListProductTileToggleNotificationAlert(productIsin) {
  return {
    type: MY_WATCH_LIST_TOGGLE_NOTIFICATION_ALERT_POPUP,
    productIsin,
  };
}

export function myWatchListProductTileSetNotificationAlert() {
  return {
    type: MY_WATCH_LIST_PRODUCT_TILE_SET_NOTIFICATION_ALERT,
  };
}

export function myWatchListGotBackendError(error) {
  return {
    type: MY_WATCH_LIST_GOT_BACKEND_ERROR,
    error,
  };
}

export function myWatchListUnmounted() {
  return {
    type: MY_WATCH_LIST_UNMOUNTED,
  };
}

export function myWatchListProductTileEditableFieldChange(
  apiUrlToUpdateField, fieldName, newValue,
) {
  return {
    type: MY_WATCH_LIST_PRODUCT_TILE_EDITABLE_FIELD_CHANGE,
    apiUrlToUpdateField,
    fieldName,
    newValue,
  };
}
