export const QUICK_SEARCH_SET_INITIAL_DATA = 'QuickSearch/QUICK_SEARCH_SET_INITIAL_DATA';
export const QUICK_SEARCH_ON_DROPDOWN_CHANGE = 'QuickSearch/QUICK_SEARCH_ON_DROPDOWN_CHANGE';
export const QUICK_SEARCH_GOT_RESULT_DATA = 'QuickSearch/QUICK_SEARCH_GOT_RESULT_DATA';
export const QUICK_SEARCH_UPDATE_PRODUCT_TYPE_URLS = 'QuickSearch/QUICK_SEARCH_UPDATE_PRODUCT_TYPE_URLS';
export const QUICK_SEARCH_UPDATE_RESET_PRODUCT_TYPE_URLS = 'QuickSearch/QUICK_SEARCH_UPDATE_RESET_PRODUCT_TYPE_URLS';
export const QUICK_SEARCH_COMPONENT_DID_UNMOUNT = 'QuickSearch/QUICK_SEARCH_COMPONENT_DID_UNMOUNT';

export function quickSearchSetInitialData(uniqId, data) {
  return {
    type: QUICK_SEARCH_SET_INITIAL_DATA,
    uniqId,
    data,
  };
}
export function quickSearchOnDropdownChange(uniqId, payload, selectedItem) {
  return {
    type: QUICK_SEARCH_ON_DROPDOWN_CHANGE,
    uniqId,
    payload,
    selectedItem,
  };
}

export function quickSearchGotResultData(uniqId, data, selectedItem) {
  return {
    type: QUICK_SEARCH_GOT_RESULT_DATA,
    uniqId,
    data,
    selectedItem,
  };
}

export function quickSearchUpdateProductTypeUrls(uniqId, name, userInputValue) {
  return {
    type: QUICK_SEARCH_UPDATE_PRODUCT_TYPE_URLS,
    uniqId,
    name,
    value: userInputValue,
  };
}

export function quickSearchUpdateResetProductTypeUrls(uniqId) {
  return {
    type: QUICK_SEARCH_UPDATE_RESET_PRODUCT_TYPE_URLS,
    uniqId,
  };
}

export function quickSearchComponentDidUnmount(uniqId) {
  return {
    type: QUICK_SEARCH_COMPONENT_DID_UNMOUNT,
    uniqId,
  };
}
