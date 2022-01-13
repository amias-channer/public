import {
  takeEvery, delay,
} from 'redux-saga/effects';

import Logger from '../utils/logger';
import {
  ANALYTICS_CLICK_TRACK,
  ANALYTICS_CONTENT_CLICK_TRACK,
  ANALYTICS_DOC_DOWNLOAD_TRACK,
  ANALYTICS_FORM_TRACK,
  ANALYTICS_FORM_TRACK_START,
  ANALYTICS_PAGE_LOAD_TRACK,
  ANALYTICS_PRODUCT_TRACK,
  ANALYTICS_RESET_FAILED_ATTEMPTS_COUNTER,
  ANALYTICS_SEARCH_TRACK,
} from './actions';
import {
  checkAnalyticsDebugMode,
  dispatchAnalyticsFormTrackStart, getAnalyticsCookie,
  getAnalyticsFunction,
  isAnalyticsLoaded,
} from './Analytics.helper';

export const TRACKING_MAX_FAILED_ATTEMPTS = 15;
export const TRACKING_INIT_RETRY_DELAY = 1500; // in ms

// number of attempts state shared between individual calls to function* sendTracking
let attempts = 0;

export function* resetFailedAttemptsCounter() {
  yield attempts = 0;
}

export function* sendTracking(action) {
  if (!getAnalyticsCookie()) {
    Logger.debug('ANALYTICS::sendTracking', 'sat_track Cookie not found');
    return;
  }
  if (!isAnalyticsLoaded() && attempts < TRACKING_MAX_FAILED_ATTEMPTS) {
    Logger.debug('ANALYTICS::sendTracking', 'NOT YET READY', 'Attempt Count', attempts);
    attempts += 1;
    yield delay(TRACKING_INIT_RETRY_DELAY);
    yield sendTracking(action);
  } else if (isAnalyticsLoaded()) {
    try {
      yield checkAnalyticsDebugMode();
      const analyticsFunction = getAnalyticsFunction(action.functionName);
      if (analyticsFunction) {
        yield analyticsFunction(...action.params);
        Logger.info('ANALYTICS::sendTracking', 'sent', action);
        if (attempts > 0) {
          yield resetFailedAttemptsCounter();
        }
      }
    } catch (e) {
      Logger.error('ANALYTICS', 'Exception', e);
    }
  }
}

function* formTrackStart(action) {
  yield dispatchAnalyticsFormTrackStart(
    action.formName,
    action.formErrorMessage,
    action.formDocumentOrderSelected,
  );
}

export const analyticsSagas = [
  takeEvery(ANALYTICS_RESET_FAILED_ATTEMPTS_COUNTER, resetFailedAttemptsCounter),
  takeEvery(ANALYTICS_PAGE_LOAD_TRACK, sendTracking),
  takeEvery(ANALYTICS_CLICK_TRACK, sendTracking),
  takeEvery(ANALYTICS_CONTENT_CLICK_TRACK, sendTracking),
  takeEvery(ANALYTICS_SEARCH_TRACK, sendTracking),
  takeEvery(ANALYTICS_PRODUCT_TRACK, sendTracking),
  takeEvery(ANALYTICS_DOC_DOWNLOAD_TRACK, sendTracking),
  takeEvery(ANALYTICS_FORM_TRACK, sendTracking),
  takeEvery(ANALYTICS_FORM_TRACK_START, formTrackStart),
];
