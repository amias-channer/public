import { delay, select, takeEvery } from 'redux-saga/effects';
import Logger from '../utils/logger';
import {
  addEventToTrackingList,
  ADFORM_TRACKING_POINT_EVENT_TYPE_CLICK,
  createTrackingPointPath,
  getAdformTracking,
  isAdformLoaded,
  shouldDoAdformTracking,
} from './AdformTracking.helper';
import {
  ADFORM_RESET_FAILED_TRACKING_ATTEMPTS_COUNTER,
  ADFORM_TRACKING_POINTS_TRACK_EVENT,
} from './actions';

const ADFORM_TRACKING_SAGAS_DEBUG_VAR = 'ADFORMTRACKING sagas';

export const TRACKING_MAX_FAILED_ATTEMPTS = 15;
export const TRACKING_INIT_RETRY_DELAY = 1500; // in ms

// number of attempts state shared between individual calls to function* sendTracking
let attempts = 0;

export function* resetFailedAttemptsCounter() {
  yield attempts = 0;
}

const getCurrentNavigationData = (state) => state.global.navigationItemData;

export function* sendTracking(action) {
  if (!shouldDoAdformTracking()) {
    Logger.debug(`${ADFORM_TRACKING_SAGAS_DEBUG_VAR}::sendTracking`, 'Not tracking adform because it is disabled.');
    return;
  }

  if (!isAdformLoaded() && attempts < TRACKING_MAX_FAILED_ATTEMPTS) {
    Logger.debug(`${ADFORM_TRACKING_SAGAS_DEBUG_VAR}::sendTracking`, 'NOT YET READY', 'Attempt Count', attempts);
    attempts += 1;
    yield delay(TRACKING_INIT_RETRY_DELAY);
    yield sendTracking(action);
  } else if (isAdformLoaded()) {
    try {
      // if (!isProductionEnv()) {
      //   Logger.debug(`${ADFORM_TRACKING_SAGAS_DEBUG_VAR}::sendTracking`,
      //     'ACTUAL TRACKING DISABLED IN DEV/QA ENVIRONMENT,'
      //     + ' INSTEAD SIMULATING TRACKING IN DEV/QA ENVIRONMENT',
      //     'sent',
      //     action);
      //   return;
      // }
      const adformTracking = getAdformTracking();
      let trackingPointPath = '';
      if (!adformTracking) {
        Logger.error(`${ADFORM_TRACKING_SAGAS_DEBUG_VAR}::sendTracking`, 'window.adf undefined');
        return;
      }
      if (adformTracking.async
        && adformTracking.async.track
        && typeof adformTracking.async.track === 'function'
        && action.trackingFunctionName
      ) {
        const currentNavigationData = yield select(getCurrentNavigationData);
        trackingPointPath = action.trackingPointPath
          || createTrackingPointPath(
            currentNavigationData.pageTitle,
            currentNavigationData.topMenuItemTitle,
          );

        if (action.trackingFunctionName === ADFORM_TRACKING_POINT_EVENT_TYPE_CLICK) {
          if (!action.trackingPointPathSegment) {
            Logger.warn(`${ADFORM_TRACKING_SAGAS_DEBUG_VAR}::sendTracking`, 'could not track event of type click, are you sure to pass "trackingPointName" to adformTrackEventClick() method correctly?');
            return;
          }
          trackingPointPath = `KeyInvest${action.divider}${action.trackingPointPathSegment}`;
        }

        // add an object containing page view tracking data
        // to a list of events to be tracked (window._adftrack)
        yield addEventToTrackingList(
          action.adformTrackingId,
          action.divider,
          trackingPointPath,
          action.params,
        );
        // call track method to track the page view added to the list previously.
        yield adformTracking.async.track();
      }
      Logger.info(`${ADFORM_TRACKING_SAGAS_DEBUG_VAR}::sendTracking`, 'sent', { ...action, trackingPointPath });
      if (attempts > 0) {
        yield resetFailedAttemptsCounter();
      }
    } catch (e) {
      Logger.error(`${ADFORM_TRACKING_SAGAS_DEBUG_VAR}::sendTracking`, 'Exception', e);
    }
  }
}

export const adformTrackingSagas = [
  takeEvery(ADFORM_RESET_FAILED_TRACKING_ATTEMPTS_COUNTER, resetFailedAttemptsCounter),
  takeEvery(ADFORM_TRACKING_POINTS_TRACK_EVENT, sendTracking),
];
