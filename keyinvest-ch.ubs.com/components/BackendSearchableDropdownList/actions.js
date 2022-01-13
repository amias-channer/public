export const BACKEND_SEARCHABLE_DROPDOWN_FETCH_DATA = 'BackendSearchableDropdown/BACKEND_SEARCHABLE_DROPDOWN_FETCH_DATA';
export const BACKEND_SEARCHABLE_DROPDOWN_GOT_DATA = 'BackendSearchableDropdown/BACKEND_SEARCHABLE_DROPDOWN_GOT_DATA';
export const BACKEND_SEARCHABLE_DROPDOWN_CHECKBOX_ITEM_CHANGED = 'BackendSearchableDropdown/BACKEND_SEARCHABLE_DROPDOWN_CHECKBOX_ITEM_CHANGED';
export const BACKEND_SEARCHABLE_MERGE_PRE_SET_LIST = 'BackendSearchableDropdown/BACKEND_SEARCHABLE_MERGE_PRE_SET_LIST';
export const BACKEND_SEARCHABLE_ON_SINGLE_ITEM_SELECT = 'BackendSearchableDropdown/BACKEND_SEARCHABLE_ON_SINGLE_ITEM_SELECT';
export const BACKEND_SEARCHABLE_FETCH_PUSH_PRICE_DATA = 'BackendSearchableDropdown/BACKEND_SEARCHABLE_FETCH_PUSH_PRICE_DATA';
export const BACKEND_SEARCHABLE_GOT_PUSH_PRICE_DATA = 'BackendSearchableDropdown/BACKEND_SEARCHABLE_GOT_PUSH_PRICE_DATA';
export const BACKEND_SEARCHABLE_COMPONENT_DID_UNMOUNT = 'BackendSearchableDropdown/BACKEND_SEARCHABLE_COMPONENT_DID_UNMOUNT';

export function backendSearchableFetchData(uniqId, url, storeDataSourcePath, dataTransformFunc) {
  return {
    type: BACKEND_SEARCHABLE_DROPDOWN_FETCH_DATA,
    uniqId,
    url,
    storeDataSourcePath,
    dataTransformFunc,
  };
}

export function backendSearchableGotData(uniqId, data) {
  return {
    type: BACKEND_SEARCHABLE_DROPDOWN_GOT_DATA,
    uniqId,
    data,
  };
}

export function backendSearchableCheckboxItemChanged(
  uniqId, listItemId, isChecked,
) {
  return {
    type: BACKEND_SEARCHABLE_DROPDOWN_CHECKBOX_ITEM_CHANGED,
    uniqId,
    listItemId,
    isChecked,
  };
}

export function backendSearchableMergePreSetList(uniqId, presetList) {
  return {
    type: BACKEND_SEARCHABLE_MERGE_PRE_SET_LIST,
    uniqId,
    presetList,
  };
}

export function backendSearchableOnSingleItemSelect(uniqId, itemData) {
  return {
    type: BACKEND_SEARCHABLE_ON_SINGLE_ITEM_SELECT,
    uniqId,
    itemData,
  };
}

export function backendSearchableFetchPushPriceData(uniqId, itemData, pushPriceUrl) {
  return {
    type: BACKEND_SEARCHABLE_FETCH_PUSH_PRICE_DATA,
    uniqId,
    itemData,
    pushPriceUrl,
  };
}

export function backendSearchableGotFetchPushPriceDataForItem(uniqId, responseData, itemData) {
  return {
    type: BACKEND_SEARCHABLE_GOT_PUSH_PRICE_DATA,
    uniqId,
    responseData,
    itemData,
  };
}

export function backendSearchableComponentDidUnmount(uniqId) {
  return {
    type: BACKEND_SEARCHABLE_COMPONENT_DID_UNMOUNT,
    uniqId,
  };
}
