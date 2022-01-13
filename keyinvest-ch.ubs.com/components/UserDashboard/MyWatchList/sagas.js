import {
  call, debounce, put, takeLatest,
} from 'redux-saga/effects';
import HttpService, {
  REQUEST_METHOD_DELETE,
  REQUEST_METHOD_PATCH,
} from '../../../utils/httpService';
import Logger from '../../../utils/logger';
import {
  MY_WATCH_LIST_FETCH_DATA,
  MY_WATCH_LIST_GET_SEARCH_RESULTS,
  MY_WATCH_LIST_GET_SORTED_LIST,
  MY_WATCH_LIST_PRODUCT_TILE_EDITABLE_FIELD_CHANGE,
  MY_WATCH_LIST_REMOVE_PRODUCT,
  myWatchListFetchData,
  myWatchListGotBackendError,
  myWatchListGotData,
  myWatchListGotSearchResults,
  myWatchListGotSortedList,
  myWatchListProductRemoved,
} from './actions';
import { initialState } from './reducer';
import {
  getEndPointToFetchSortedList,
  MY_WATCHLIST_API_GET_PRODUCTS_ENDPOINT,
} from './MyWatchList.helper';
import { DEFAULT_GENERATE_TOKEN_PATH } from '../../Forms/Forms.helper';

export function getCsrfToken(url) {
  try {
    return call(
      HttpService.fetch,
      HttpService.generateUrl() + url + DEFAULT_GENERATE_TOKEN_PATH,
    );
  } catch (e) {
    Logger.error('Failed getCsrfToken for ', url, e);
    return e;
  }
}

export function* fetchData(action) {
  try {
    const response = yield call(
      HttpService.fetch,
      `${HttpService.getPageApiUrl()}/${action.url}`,
    );
    yield put(myWatchListGotData(response.data));
  } catch (e) {
    Logger.error('USER_DASHBOARD_MY_WATCHLIST_SECTION', 'Failed to fetch content', e);
    yield put(myWatchListGotBackendError(e));
  }
}

export function* getSearchResults(action) {
  try {
    const params = {
      withCredentials: false,
    };
    const response = yield call(
      HttpService.fetch,
      `${HttpService.generateUrl()}${action.url}&q=${action.searchText}`,
      params,
    );
    yield put(myWatchListGotSearchResults(response));
  } catch (e) {
    Logger.error('USER_DASHBOARD_MY_WATCHLIST_PRODUCT_SEARCH', 'Failed to fetch content', e);
    yield put(myWatchListGotSearchResults(e));
  }
}

export function* removeProductFromWatchList(action) {
  yield getCsrfToken(action.url);
  const params = {
    method: REQUEST_METHOD_DELETE,
    withCredentials: true,
  };

  try {
    const response = yield call(
      HttpService.fetch,
      `${HttpService.generateUrl()}${action.url}`,
      params,
    );
    yield put(myWatchListProductRemoved(response));
    if (action.onProductRemoveSuccessCallback && typeof action.onProductRemoveSuccessCallback === 'function') {
      action.onProductRemoveSuccessCallback();
    }
  } catch (e) {
    Logger.error('USER_DASHBOARD_MY_WATCHLIST_SECTION', 'Failed to remove product from watch list', e);
    yield put(myWatchListGotBackendError(e));
  }
}

export function* getSortedList(action) {
  try {
    const response = yield call(
      HttpService.fetch,
      `${HttpService.getPageApiUrl()}/${getEndPointToFetchSortedList(action.url, action.sortBy, action.sortDirection)}`,
    );
    yield put(myWatchListGotSortedList(response.data, action.sortBy, action.sortDirection));
  } catch (e) {
    Logger.error('USER_DASHBOARD_MY_WATCHLIST_SECTION', 'Failed to fetch Sorted list content', e);
    yield put(myWatchListGotData(initialState));
    yield put(myWatchListGotBackendError(e));
  }
}

export function* updateProductTileField(action) {
  try {
    yield getCsrfToken(action.apiUrlToUpdateField);
    const { fieldName, newValue } = action;
    const params = {
      method: REQUEST_METHOD_PATCH,
      data: { [fieldName]: newValue },
      withCredentials: true,
    };
    yield call(
      HttpService.fetch,
      `${HttpService.generateUrl()}${action.apiUrlToUpdateField}`,
      params,
    );
    yield put(myWatchListFetchData(MY_WATCHLIST_API_GET_PRODUCTS_ENDPOINT));
  } catch (e) {
    Logger.error('USER_DASHBOARD_MY_WATCHLIST_SECTION', 'Failed to update product tile field', e);
    yield put(myWatchListGotBackendError(e));
  }
}

export const myWatchListSagas = [
  takeLatest(MY_WATCH_LIST_FETCH_DATA, fetchData),
  debounce(400, MY_WATCH_LIST_GET_SEARCH_RESULTS, getSearchResults),
  takeLatest(MY_WATCH_LIST_REMOVE_PRODUCT, removeProductFromWatchList),
  takeLatest(MY_WATCH_LIST_GET_SORTED_LIST, getSortedList),
  takeLatest(MY_WATCH_LIST_PRODUCT_TILE_EDITABLE_FIELD_CHANGE, updateProductTileField),
];
