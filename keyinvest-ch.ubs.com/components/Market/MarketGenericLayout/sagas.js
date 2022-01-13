import {
  takeLatest, put, call,
} from 'redux-saga/effects';
import { parsePath } from 'history';
import Logger from '../../../utils/logger';
import {
  MARKET_GENERIC_FETCH_CONTENT, MARKET_GENERIC_FETCH_SORTED_TABLE_DATA,
  marketGenericGotContent, marketGenericGotSortedTableData,
} from './actions';
import HttpService from '../../../utils/httpService';
import { STATE_NAME_MARKET_OVERVIEW } from '../../../main/constants';
import { getTileDataUrlForInstrument } from '../../../utils/utils';


export function* fetchContent(action) {
  try {
    let param = '';
    if (action.instrument) {
      param = getTileDataUrlForInstrument(action.instrument);
    }
    const response = yield call(HttpService.fetch, `${action.stateName ? parsePath(HttpService.getBackendUrlByStateName(action.stateName)).pathname : HttpService.getBackendUrlByStateName(STATE_NAME_MARKET_OVERVIEW)}${param}`);
    yield put(marketGenericGotContent(action.instrument ? action.instrument : null, response.data));
  } catch (e) {
    // yield put(fetchFailed(e));
    Logger.error('MARKET_OVERVIEW_PAGE', 'Failed to fetch content', e);
    yield put(marketGenericGotContent([]));
  }
}

export function* fetchSortedTableData(action) {
  const response = yield call(HttpService.fetch, `${parsePath(HttpService.getBackendUrlByStateName(action.stateName)).pathname}?sortBy=${action.sortBy}&sortDirection=${action.sortDirection}`);
  yield put(marketGenericGotSortedTableData(response.data));
}

export const marketOverviewSagas = [
  takeLatest(MARKET_GENERIC_FETCH_CONTENT, fetchContent),
  takeLatest(MARKET_GENERIC_FETCH_SORTED_TABLE_DATA, fetchSortedTableData),
];
