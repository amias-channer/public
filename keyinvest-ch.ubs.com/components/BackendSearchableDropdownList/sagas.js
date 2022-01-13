import {
  put, debounce, call, takeEvery,
} from 'redux-saga/effects';
import {
  BACKEND_SEARCHABLE_DROPDOWN_FETCH_DATA,
  BACKEND_SEARCHABLE_FETCH_PUSH_PRICE_DATA,
  backendSearchableGotData, backendSearchableGotFetchPushPriceDataForItem,
} from './actions';
import Logger from '../../utils/logger';
import HttpService from '../../utils/httpService';
import { defaultDataTransform } from './BackendSearchableDropdownList.helper';
import { DEFAULT_GENERATE_TOKEN_PATH } from '../Forms/Forms.helper';

export function* fetchData(action) {
  try {
    const response = yield call(HttpService.fetch, `${HttpService.generateUrl()}${action.url}`);
    const transformedData = typeof action.dataTransformFunc === 'function' ? yield action.dataTransformFunc(response) : defaultDataTransform(response);
    yield put(backendSearchableGotData(action.uniqId, transformedData, action.storeDataSourcePath));
  } catch (error) {
    Logger.error(action.type, error);
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

export function* onFetchPushPriceData(action) {
  try {
    yield getCsrfToken(action.pushPriceUrl);
    const response = yield call(
      HttpService.fetch,
      HttpService.getPageApiUrl() + action.pushPriceUrl,
    );
    if (response && response.data) {
      yield put(backendSearchableGotFetchPushPriceDataForItem(
        action.uniqId,
        response.data,
        action.itemData,
      ));
    }
  } catch (e) {
    Logger.error('Failed to fetch push price data for ', action.type, e);
  }
}

export const backendSearchableDropdownSagas = [
  debounce(400, BACKEND_SEARCHABLE_DROPDOWN_FETCH_DATA, fetchData),
  takeEvery(BACKEND_SEARCHABLE_FETCH_PUSH_PRICE_DATA, onFetchPushPriceData),
];
