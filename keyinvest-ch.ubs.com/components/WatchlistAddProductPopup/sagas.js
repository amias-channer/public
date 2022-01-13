import {
  call, put, takeLatest,
} from 'redux-saga/effects';
import { pathOr } from 'ramda';
import HttpService, { REQUEST_METHOD_PUT } from '../../utils/httpService';

import Logger from '../../utils/logger';
import {
  MY_WATCH_LIST_ADD_PRODUCT,
  MY_WATCH_LIST_GET_ASK_PRICE_FOR_PRODUCT, myWatchListAskPriceError,
  myWatchListGotAskPriceForProduct,
  myWatchListProductAdded, myWatchListProductAddFailed,
  myWatchListProductPopupCalculateTotalSum,
  myWatchListSetProductToAdd,
} from './actions';
import { DEFAULT_GENERATE_TOKEN_PATH } from '../Forms/Forms.helper';
import { searchAndReplaceTextInString } from '../../utils/utils';

export function getCsrfToken(url) {
  try {
    return call(
      HttpService.fetch,
      `${HttpService.getPageApiUrl()}/${url}${DEFAULT_GENERATE_TOKEN_PATH}`,
    );
  } catch (e) {
    Logger.error('Failed getCsrfToken for ', url, e);
    return e;
  }
}


export function* addProductToWatchList(action) {
  yield getCsrfToken(action.url);
  const params = {
    method: REQUEST_METHOD_PUT,
    data: action.data,
    withCredentials: true,
  };

  try {
    const response = yield call(
      HttpService.fetch,
      `${HttpService.getPageApiUrl()}/${action.url}/${action.isin}`,
      params,
    );
    if (action.onAddProductToWatchlistSuccessFn) {
      yield action.onAddProductToWatchlistSuccessFn(response);
    }
    yield put(myWatchListProductAdded());
  } catch (e) {
    Logger.error('WATCHLIST_ADD_PRODUCT_POPUP', 'Failed to add product to watch list', e);
    if (action.onAddProductToWatchlistFailureFn) {
      yield action.onAddProductToWatchlistFailureFn(e);
    }
    yield put(myWatchListProductAddFailed(e));
  }
}

export function* getAskPriceForProduct(action) {
  try {
    const url = searchAndReplaceTextInString(':isin', action.productData.isin, action.url);
    yield getCsrfToken(url);
    const response = yield call(
      HttpService.fetch,
      `${HttpService.getPageApiUrl()}/${url}`,
    );
    yield put(myWatchListSetProductToAdd({
      ...action.productData,
      purchasePrice: pathOr('', ['data', 'value'], response),
      currency: pathOr('', ['data', 'currency'], response),
      notionalValue: pathOr('', ['data', 'notionalValue'], response),
    }));
    yield put(myWatchListGotAskPriceForProduct());
    yield put(myWatchListProductPopupCalculateTotalSum());
  } catch (e) {
    yield put(myWatchListAskPriceError(e));
    Logger.error('WATCHLIST_ADD_PRODUCT_POPUP', 'Failed to get ask price for product:', action.productData, e);
  }
}

export const watchlistAddProductPopup = [
  takeLatest(MY_WATCH_LIST_ADD_PRODUCT, addProductToWatchList),
  takeLatest(MY_WATCH_LIST_GET_ASK_PRICE_FOR_PRODUCT, getAskPriceForProduct),
];
