import {
  takeLatest, put, call,
} from 'redux-saga/effects';

import Logger from '../../../utils/logger';
import HttpService from '../../../utils/httpService';
import { VOLATILITY_MONITOR_FETCH_CONTENT, volatilityMonitorGotContent } from './actions';
import { STATE_NAME_MARKET_VOLATILITY_MONITOR } from '../../../main/constants';
import { initialState } from './reducer';

export function* fetchContent() {
  try {
    const response = yield call(
      HttpService.fetch,
      HttpService.getBackendUrlByStateName(STATE_NAME_MARKET_VOLATILITY_MONITOR),
    );
    yield put(volatilityMonitorGotContent(response.data));
  } catch (e) {
    Logger.error('VOLATILITY_MONITOR_PAGE', 'Failed to fetch content', e);
    yield put(volatilityMonitorGotContent(initialState.data));
  }
}

export const volatilityMonitorSagas = [
  takeLatest(VOLATILITY_MONITOR_FETCH_CONTENT, fetchContent),
];
