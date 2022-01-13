import {
  call, put, takeLatest,
} from 'redux-saga/effects';
import { pathOr } from 'ramda';
import HttpService, {
  REQUEST_METHOD_DELETE,
  REQUEST_METHOD_PATCH,
  REQUEST_METHOD_PUT,
} from '../../../utils/httpService';
import Logger from '../../../utils/logger';
import {
  MY_SEARCHES_FETCH_DATA,
  MY_SEARCHES_REMOVE,
  MY_SEARCHES_SAVE,
  MY_SEARCHES_UPDATE_NAME, mySearchesClearSearchName,
  mySearchesFetchData,
  mySearchesGotData,
  mySearchesGotRemove,
  mySearchesGotSave,
  mySearchesGotUpdateName,
} from './actions';
import { MY_SEARCHES_API_GET_URL } from './MySearches.helper';
import { DEFAULT_GENERATE_TOKEN_PATH } from '../../Forms/Forms.helper';

export function* fetchData() {
  try {
    const response = yield call(
      HttpService.fetch,
      `${HttpService.getPageApiUrl()}${MY_SEARCHES_API_GET_URL}`,
    );
    yield put(mySearchesGotData(pathOr({}, ['data', 'searches'], response), null));
  } catch (e) {
    Logger.error('USER_DASHBOARD_MY_SEARCHES_SECTION', 'Failed to fetch content', e);
    yield put(mySearchesGotData(null, e));
  }
}
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

export function* searchSave(action) {
  try {
    const endpoint = pathOr('', ['saveEndpoint'], action);
    yield getCsrfToken(endpoint);
    const searchUrl = pathOr('', ['searchUrl'], action);
    const searchName = pathOr('', ['searchName'], action);
    const stateName = pathOr('', ['stateName'], action);
    const tags = pathOr([], ['tags'], action);
    const response = yield call(
      HttpService.fetch,
      `${HttpService.getPageApiUrl()}${endpoint}`,
      {
        method: REQUEST_METHOD_PUT,
        data: {
          name: searchName,
          query: searchUrl,
          stateName,
          tags,
        },
      },
    );
    yield put(mySearchesGotSave(response, null));
    yield put(mySearchesClearSearchName());
  } catch (e) {
    Logger.error('USER_DASHBOARD_MY_SEARCHES_SECTION', 'Failed to save search', e);
    yield put(mySearchesGotSave(null, e));
  }
}

export function* searchUpdate(action) {
  try {
    const endpoint = pathOr('', ['item', 'updateUrl'], action);
    yield getCsrfToken(endpoint);
    const newName = pathOr('', ['newName'], action);
    const response = yield call(
      HttpService.fetch,
      `${HttpService.getPageApiUrl()}${endpoint}`,
      { method: REQUEST_METHOD_PATCH, data: { name: newName } },
    );
    yield put(mySearchesGotUpdateName(response.data, null));
  } catch (e) {
    Logger.error('USER_DASHBOARD_MY_SEARCHES_SECTION', 'Failed to update search', e);
    yield put(mySearchesGotUpdateName(null, e));
  }
}

export function* searchRemove(action) {
  try {
    const endpoint = pathOr('', ['item', 'removeUrl'], action);
    yield getCsrfToken(endpoint);
    const response = yield call(
      HttpService.fetch,
      `${HttpService.getPageApiUrl()}${endpoint}`,
      { method: REQUEST_METHOD_DELETE },
    );
    yield put(mySearchesGotRemove(response.data, null));
    yield put(mySearchesFetchData());
  } catch (e) {
    Logger.error('USER_DASHBOARD_MY_SEARCHES_SECTION', 'Failed to remove search', e);
    yield put(mySearchesGotRemove(null, e));
  }
}

export const mySearchesSagas = [
  takeLatest(MY_SEARCHES_FETCH_DATA, fetchData),
  takeLatest(MY_SEARCHES_SAVE, searchSave),
  takeLatest(MY_SEARCHES_UPDATE_NAME, searchUpdate),
  takeLatest(MY_SEARCHES_REMOVE, searchRemove),
];
