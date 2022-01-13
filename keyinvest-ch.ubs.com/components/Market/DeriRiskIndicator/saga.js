import {
  takeLatest, put, call,
} from 'redux-saga/effects';

import Logger from '../../../utils/logger';
import HttpService from '../../../utils/httpService';
import {
  DERI_RISK_INDICATOR_FETCH_CONTENT, deriRiskIndicatorGotContent,
} from './actions';
import { initialState } from './reducer';
import { STATE_NAME_MARKET_DERI_RISK_INDICATOR } from '../../../main/constants';
import {
  dispatchAnalyticsClickTrack,
  NETCENTRIC_CTA_TYPE_HTML_TEXT,
} from '../../../analytics/Analytics.helper';

export const getDeriRiskIndicatorUrl = (tileType) => `${HttpService.getBackendUrlByStateName(STATE_NAME_MARKET_DERI_RISK_INDICATOR)}type=${tileType}`;

export function* fetchContent(action) {
  try {
    const url = getDeriRiskIndicatorUrl(action.tileType);
    const { trackingData } = action;
    if (trackingData) {
      dispatchAnalyticsClickTrack(
        trackingData.text,
        url,
        NETCENTRIC_CTA_TYPE_HTML_TEXT,
        trackingData.parent,
      );
    }
    const response = yield call(
      HttpService.fetch,
      url,
    );
    yield put(deriRiskIndicatorGotContent(response.data));
  } catch (e) {
    Logger.error('VOLATILITY_MONITOR_PAGE', 'Failed to fetch content', e);
    yield put(deriRiskIndicatorGotContent(initialState.data));
  }
}

export const deriRiskIndicatorSagas = [
  takeLatest(DERI_RISK_INDICATOR_FETCH_CONTENT, fetchContent),
];
