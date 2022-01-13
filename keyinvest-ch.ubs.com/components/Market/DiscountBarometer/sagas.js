import {
  takeLatest, put, call,
} from 'redux-saga/effects';

import Logger from '../../../utils/logger';
import HttpService from '../../../utils/httpService';
import { DISCOUNT_BAROMETER_FETCH_CONTENT, discountBarometerGotContent } from './actions';
import {
  STATE_NAME_MARKET_DISCOUNT_BAROMETER,
} from '../../../main/constants';

export function* fetchContent() {
  try {
    const response = yield call(
      HttpService.fetch,
      HttpService.getBackendUrlByStateName(STATE_NAME_MARKET_DISCOUNT_BAROMETER),
    );
    yield put(discountBarometerGotContent(response.data));
  } catch (e) {
    // yield put(fetchFailed(e));
    Logger.error('DISCOUNT_BAROMETER_PAGE', 'Failed to fetch content', e);
    yield put(discountBarometerGotContent({}));
  }
}

export const discountBarometerSagas = [
  takeLatest(DISCOUNT_BAROMETER_FETCH_CONTENT, fetchContent),
];
