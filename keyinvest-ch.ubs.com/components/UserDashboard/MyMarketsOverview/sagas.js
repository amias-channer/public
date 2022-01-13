import {
  takeLatest, put, call, debounce,
} from 'redux-saga/effects';
import { path } from 'ramda';
import Logger from '../../../utils/logger';
import HttpService, {
  REQUEST_METHOD_DELETE, REQUEST_METHOD_PUT,
} from '../../../utils/httpService';
import {
  MY_MARKETS_DELETE_UNDERLYING,
  MY_MARKETS_FETCH_UNDERLYINGS_LIST,
  MY_MARKETS_GET_SEARCH_RESULTS, MY_MARKETS_PUT_UNDERLYING,
  myMarketsFetchUnderlyingsList,
  myMarketsGotDeleteUnderlying, myMarketsGotPutUnderlying,
  myMarketsGotSearchResults,
  myMarketsGotUnderlyingsList,
} from './actions';
import { DEFAULT_GENERATE_TOKEN_PATH } from '../../Forms/Forms.helper';

export function* fetchMyUnderlyings() {
  try {
    const response = yield call(
      HttpService.fetch,
      `${HttpService.getPageApiUrl()}/user/my-underlyings`,
    );
    yield put(myMarketsGotUnderlyingsList(response.data));
  } catch (e) {
    // yield put(fetchFailed(e));
    Logger.error('MY_MARKET_OVERVIEW_PAGE', 'Failed to fetch content', e);
    yield put(myMarketsGotUnderlyingsList({}));
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
    yield put(myMarketsGotSearchResults(response));
  } catch (e) {
    Logger.error('USER_DASHBOARD_MY_MARKETS_PRODUCT_SEARCH', 'Failed to fetch content', e);
    yield put(myMarketsGotSearchResults(null, e));
  }
}

export function getCsrfToken(url) {
  try {
    return call(
      HttpService.fetch,
      url + DEFAULT_GENERATE_TOKEN_PATH,
    );
  } catch (e) {
    Logger.error('Failed getCsrfToken for ', url, e);
    return e;
  }
}

export function* addUnderlyingToMyMarkets(action) {
  const params = {
    method: REQUEST_METHOD_PUT,
    data: action.data,
    withCredentials: true,
  };

  try {
    const endpoint = `${HttpService.getPageApiUrl()}${action.url}`;
    yield getCsrfToken(endpoint);
    const response = yield call(
      HttpService.fetch,
      endpoint,
      params,
    );
    yield put(myMarketsGotPutUnderlying(response));
    yield put(myMarketsFetchUnderlyingsList());
  } catch (e) {
    Logger.error('USER_DASHBOARD_MY_MARKETS_SECTION', 'Failed to add underlying to my markets', e);
    yield put(myMarketsGotPutUnderlying(null, e));
    yield put(myMarketsFetchUnderlyingsList());
  }
}
export function* deleteUnderlying(action) {
  try {
    const endpoint = HttpService.getPageApiUrl() + path(['underlyingData', 'urlRemoveUnderlying'], action);
    yield getCsrfToken(endpoint);
    yield call(
      HttpService.fetch,
      endpoint,
      { method: REQUEST_METHOD_DELETE },
    );
    yield put(myMarketsGotDeleteUnderlying(action.underlyingData, null));
    yield put(myMarketsFetchUnderlyingsList());
  } catch (e) {
    // yield put(fetchFailed(e));
    Logger.error('MY_MARKET_OVERVIEW_PAGE', 'Failed to fetch content', e);
    yield put(myMarketsGotDeleteUnderlying(null, e));
    yield put(myMarketsFetchUnderlyingsList());
  }
}

export const myMarketOverviewSagas = [
  takeLatest(MY_MARKETS_FETCH_UNDERLYINGS_LIST, fetchMyUnderlyings),
  takeLatest(MY_MARKETS_DELETE_UNDERLYING, deleteUnderlying),
  takeLatest(MY_MARKETS_PUT_UNDERLYING, addUnderlyingToMyMarkets),
  debounce(400, MY_MARKETS_GET_SEARCH_RESULTS, getSearchResults),
];
