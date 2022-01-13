export const MY_WATCH_LIST_RESET_ADD_PRODUCT_POPUP = 'MyWatchList/MY_WATCH_LIST_RESET_ADD_PRODUCT_POPUP';
export const MY_WATCH_LIST_ADD_PRODUCT = 'MyWatchList/MY_WATCH_LIST_ADD_PRODUCT';
export const MY_WATCH_LIST_PRODUCT_ADDED = 'MyWatchList/MY_WATCH_LIST_PRODUCT_ADDED';
export const MY_WATCH_LIST_PRODUCT_ADD_FAILED = 'MyWatchList/MY_WATCH_LIST_PRODUCT_ADD_FAILED';
export const MY_WATCH_LIST_PRODUCT_POPUP_CALCULATE_TOTAL_SUM = 'MyWatchList/MY_WATCH_LIST_PRODUCT_POPUP_CALCULATE_TOTAL_SUM';
export const MY_WATCH_LIST_TOGGLE_ADD_PRODUCT_POPUP = 'MyWatchList/MY_WATCH_LIST_TOGGLE_ADD_PRODUCT_POPUP';
export const MY_WATCH_LIST_SET_PRODUCT_TO_ADD = 'MyWatchList/MY_WATCH_LIST_SET_PRODUCT_TO_ADD';
export const MY_WATCH_LIST_GET_ASK_PRICE_FOR_PRODUCT = 'MyWatchList/MY_WATCH_LIST_GET_ASK_PRICE_FOR_PRODUCT';
export const MY_WATCH_LIST_GOT_ASK_PRICE_FOR_PRODUCT = 'MyWatchList/MY_WATCH_LIST_GOT_ASK_PRICE_FOR_PRODUCT';
export const MY_WATCH_LIST_ASK_PRICE_ERROR = 'MyWatchList/MY_WATCH_LIST_ASK_PRICE_ERROR';
export const MY_WATCH_LIST_PRODUCT_POPUP_DISMISS_ERROR = 'MyWatchList/MY_WATCH_LIST_PRODUCT_POPUP_DISMISS_ERROR';
export const MY_WATCH_LIST_PRODUCT_POPUP_VALIDATE_INPUT_FIELD = 'MyWatchList/MY_WATCH_LIST_PRODUCT_POPUP_VALIDATE_INPUT_FIELD';

export function myWatchListResetAddProductPopup() {
  return {
    type: MY_WATCH_LIST_RESET_ADD_PRODUCT_POPUP,
  };
}

export function myWatchListToggleAddProductPopup() {
  return {
    type: MY_WATCH_LIST_TOGGLE_ADD_PRODUCT_POPUP,
  };
}

export function myWatchListSetProductToAdd(productData) {
  return {
    type: MY_WATCH_LIST_SET_PRODUCT_TO_ADD,
    productData,
  };
}

export function myWatchListAddProduct(
  url, isin, data,
  onAddProductToWatchlistSuccessFn,
  onAddProductToWatchlistFailureFn,
) {
  return {
    type: MY_WATCH_LIST_ADD_PRODUCT,
    url,
    isin,
    data,
    onAddProductToWatchlistSuccessFn,
    onAddProductToWatchlistFailureFn,
  };
}

export function myWatchListProductAdded() {
  return {
    type: MY_WATCH_LIST_PRODUCT_ADDED,
  };
}

export function myWatchListProductAddFailed(response) {
  return {
    type: MY_WATCH_LIST_PRODUCT_ADD_FAILED,
    response,
  };
}

export function myWatchListProductPopupCalculateTotalSum(fieldName, value) {
  return {
    type: MY_WATCH_LIST_PRODUCT_POPUP_CALCULATE_TOTAL_SUM,
    fieldName,
    value,
  };
}

export function myWatchListGetAskPriceForProduct(url, productData) {
  return {
    type: MY_WATCH_LIST_GET_ASK_PRICE_FOR_PRODUCT,
    url,
    productData,
  };
}

export function myWatchListGotAskPriceForProduct() {
  return {
    type: MY_WATCH_LIST_GOT_ASK_PRICE_FOR_PRODUCT,
  };
}


export function myWatchListAskPriceError(error) {
  return {
    type: MY_WATCH_LIST_ASK_PRICE_ERROR,
    error,
  };
}

export function myWatchListProductPopupValidateInputField(fieldName, fieldValue) {
  return {
    type: MY_WATCH_LIST_PRODUCT_POPUP_VALIDATE_INPUT_FIELD,
    fieldName,
    fieldValue,
  };
}
