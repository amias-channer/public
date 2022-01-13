import { call, put, takeLatest } from 'redux-saga/effects';
import { parsePath } from 'history';
import Logger from '../../../utils/logger';
import {
  MARKET_INSTRUMENT_TABLE_FETCH_INSTRUMENT_DETAILS,
  marketInstrumentTableGotInstrumentDetails,
} from './actions';
import HttpService from '../../../utils/httpService';
import { STATE_NAME_MARKET_OVERVIEW } from '../../../main/constants';
import {
  dispatchAnalyticsClickTrack,
  NETCENTRIC_CTA_TYPE_HTML_TEXT,
} from '../../../analytics/Analytics.helper';
import { getTileDataUrlForInstrument } from '../../../utils/utils';

export const getTileDataUrl = (instrument) => {
  let param = '';
  if (instrument) {
    param = getTileDataUrlForInstrument(instrument);
  }
  return `${parsePath(HttpService.getBackendUrlByStateName(STATE_NAME_MARKET_OVERVIEW)).pathname}${param}`;
};

export function* fetchInstrumentDetails(action) {
  try {
    const url = getTileDataUrl(action.instrument);
    const { trackingData } = action;
    if (trackingData) {
      dispatchAnalyticsClickTrack(
        trackingData.text,
        url,
        NETCENTRIC_CTA_TYPE_HTML_TEXT,
        trackingData.parent,
      );
    }

    const response = yield call(HttpService.fetch, url);
    yield put(
      marketInstrumentTableGotInstrumentDetails(
        action.tableUniqKey, action.instrument, response.data,
      ),
    );
  } catch (e) {
    Logger.error('MARKET_INSTRUMENT_TABLE_DETAILS', 'Failed to fetch content', e);
    yield put(
      marketInstrumentTableGotInstrumentDetails(action.tableUniqKey, action.instrument, {}),
    );
  }
}

export const marketInstrumentTableSagas = [
  takeLatest(MARKET_INSTRUMENT_TABLE_FETCH_INSTRUMENT_DETAILS, fetchInstrumentDetails),
];
