export const MY_SAVED_ITEMS_LIST_FETCH_DATA = 'MySavedItemsList/MY_SAVED_ITEMS_LIST_FETCH_DATA';
export const MY_SAVED_ITEMS_LIST_GOT_DATA = 'MySavedItemsList/MY_SAVED_ITEMS_LIST_GOT_DATA';
export const MY_SAVED_ITEMS_LIST_FETCH_FULL_DATA = 'MySavedItemsList/MY_SAVED_ITEMS_LIST_FETCH_FULL_DATA';
export const MY_SAVED_ITEMS_LIST_GOT_FULL_DATA = 'MySavedItemsList/MY_SAVED_ITEMS_LIST_GOT_FULL_DATA';

export const MY_SAVED_ITEMS_LIST_REMOVE_ITEM = 'MySavedItemsList/MY_SAVED_ITEMS_LIST_REMOVE_ITEM';
export const MY_SAVED_ITEMS_LIST_GOT_REMOVE_ITEM = 'MySavedItemsList/MY_SAVED_ITEMS_LIST_GOT_REMOVE_ITEM';

export const MY_SAVED_ITEMS_LIST_WILL_UNMOUNT = 'MySavedItemsList/MY_SAVED_ITEMS_LIST_WILL_UNMOUNT';

export function mySavedItemsListFetchData(uniqId, payload) {
  return {
    type: MY_SAVED_ITEMS_LIST_FETCH_DATA,
    uniqId,
    payload,
  };
}

export function mySavedItemsListGotData(uniqId, payload, failure) {
  return {
    type: MY_SAVED_ITEMS_LIST_GOT_DATA,
    uniqId,
    payload,
    failure,
  };
}

export function mySavedItemsListFetchFullData(payload) {
  return {
    type: MY_SAVED_ITEMS_LIST_FETCH_FULL_DATA,
    payload,
  };
}

export function mySavedItemsListGotFullData(payload, failure) {
  return {
    type: MY_SAVED_ITEMS_LIST_GOT_FULL_DATA,
    payload,
    failure,
  };
}

export function mySavedItemsListRemoveItem(uniqId, payload) {
  return {
    type: MY_SAVED_ITEMS_LIST_REMOVE_ITEM,
    uniqId,
    payload,
  };
}

export function mySavedItemsListGotRemoveItem(uniqId, payload, failure) {
  return {
    type: MY_SAVED_ITEMS_LIST_GOT_REMOVE_ITEM,
    uniqId,
    payload,
    failure,
  };
}

export function mySavedItemsListWillUnmount(uniqId) {
  return {
    type: MY_SAVED_ITEMS_LIST_WILL_UNMOUNT,
    uniqId,
  };
}
