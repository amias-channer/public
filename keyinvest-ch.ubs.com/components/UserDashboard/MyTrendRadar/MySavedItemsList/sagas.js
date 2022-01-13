import {
  call, put, takeLatest,
} from 'redux-saga/effects';
import { pathOr } from 'ramda';
import Logger from '../../../../utils/logger';
import HttpService, { REQUEST_METHOD_DELETE } from '../../../../utils/httpService';
import {
  MY_SAVED_ITEMS_LIST_FETCH_DATA,
  MY_SAVED_ITEMS_LIST_FETCH_FULL_DATA,
  MY_SAVED_ITEMS_LIST_REMOVE_ITEM,
  mySavedItemsListFetchData,
  mySavedItemsListGotData,
  mySavedItemsListGotFullData,
  mySavedItemsListGotRemoveItem,
} from './actions';
import { DEFAULT_GENERATE_TOKEN_PATH } from '../../../Forms/Forms.helper';
import { setQueryParamsToUrl } from '../../../../utils/utils';


export function getCsrfToken(url) {
  try {
    return call(
      HttpService.fetch,
      HttpService.getPageApiUrl() + url + DEFAULT_GENERATE_TOKEN_PATH,
    );
  } catch (e) {
    Logger.error('Failed getCsrfToken for ', url, e);
    return e;
  }
}

export function* fetchData(action) {
  const uniqId = pathOr('', ['uniqId'], action);
  const baseUrl = pathOr('', ['payload', 'url'], action);
  const queryParams = pathOr({}, ['payload', 'queryParams'], action);
  const url = setQueryParamsToUrl(baseUrl, queryParams);
  try {
    const response = yield call(
      HttpService.fetch,
      `${HttpService.getPageApiUrl()}${url}`,
    );
    yield put(mySavedItemsListGotData(uniqId, response, null));
  } catch (e) {
    Logger.error('USER_DASHBOARD_MY_SAVED_ITEMS_LIST_SECTION', 'Failed to fetch content', url, e);
    yield put(mySavedItemsListGotData(uniqId, {}, e));
  }
}

export function* fetchFullData(action) {
  const url = pathOr('', ['payload', 'url'], action);
  try {
    const response = yield call(
      HttpService.fetch,
      `${HttpService.getPageApiUrl()}${url}`,
    );
    yield put(mySavedItemsListGotFullData(response, null));
  } catch (e) {
    Logger.error('USER_DASHBOARD_MY_SAVED_ITEMS_LIST_SECTION', 'Failed to fetch full data', action, url, e);
    yield put(mySavedItemsListGotFullData(null, e));
  }
}

export function* removeItem(action) {
  const uniqId = pathOr('', ['uniqId'], action);
  const url = pathOr('', ['payload', 'removeUrl'], action);
  try {
    yield getCsrfToken(url);
    const response = yield call(
      HttpService.fetch,
      `${HttpService.getPageApiUrl()}${url}`,
      { method: REQUEST_METHOD_DELETE },
    );
    yield put(mySavedItemsListGotRemoveItem(uniqId, response, null));
    yield put(mySavedItemsListFetchData(uniqId, action.payload));
  } catch (e) {
    Logger.error('USER_DASHBOARD_MY_SAVED_ITEMS_LIST_SECTION', 'Failed to remove item', action, url, e);
    yield put(mySavedItemsListGotRemoveItem(uniqId, null, e));
  }
}

export const savedItemsListSagas = [
  takeLatest(MY_SAVED_ITEMS_LIST_FETCH_DATA, fetchData),
  takeLatest(MY_SAVED_ITEMS_LIST_FETCH_FULL_DATA, fetchFullData),
  takeLatest(MY_SAVED_ITEMS_LIST_REMOVE_ITEM, removeItem),
];
