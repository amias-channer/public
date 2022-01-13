import {
  takeEvery, put, call,
} from 'redux-saga/effects';

import Logger from '../../../utils/logger';
import HttpService from '../../../utils/httpService';
import getAppConfig from '../../../main/AppConfig';
import { ASYNC_CHART_FETCH_CONTENT, asyncChartGotContent } from './actions';

export function* fetchContent(action) {
  try {
    const response = yield call(HttpService.fetch, `${HttpService.generateUrl(getAppConfig().pageApiPath)}${action.url}`);
    yield put(asyncChartGotContent(action.uniqKey, response.data));
  } catch (e) {
    // yield put(fetchFailed(e));
    Logger.error('ASYNC_CHART', action.uniqKey, 'Failed to fetch content from', action.url, e);
    yield put(asyncChartGotContent(action.uniqKey, {}));
  }
}

export const asyncChartSagas = [
  takeEvery(ASYNC_CHART_FETCH_CONTENT, fetchContent),
];
