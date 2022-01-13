import {
  call,
  debounce,
  throttle,
  takeEvery,
  put,
  select,
  take,
} from 'redux-saga/effects';
import Logger from '../../utils/logger';

import {
  PUSH_MANAGER_ADD_SUBSCRIPTION,
  PUSH_MANAGER_UPDATE_SUBSCRIPTIONS,
  PUSH_MANAGER_SUBMIT_SUBSCRIPTIONS,
  PUSH_MANAGER_WEBSOCKET_ESTABLISH_CONNECTION,
  PUSH_MANAGER_WEBSOCKET_CONNECTION_FAILURE,
  PUSH_MANAGER_RECEIVED_MESSAGE,
  PUSH_MANAGER_HTTP_ESTABLISH_CONNECTION,
  PUSH_MANAGER_HTTP_CONNECTION_FAILURE,
  pushManagerSubmitSubscriptions,
  pushManagerUpdateSubscriptions,
  pushManagerUpdateStoreState,
  pushManagerUpdateStoreStateReceivedMessage,
  pushManagerClearPushData,
  pushManagerWebsocketEstablishConnection,
  pushManagerWebsocketConnectionFailure,
  pushManagerHttpEstablishConnection,
  pushManagerHttpConnectionFailure,
  PUSH_MANAGER_RECEIVED_ERROR_MESSAGE,
  pushManagerTrackTick, PUSH_MANAGER_TRACK_TICK,
} from './actions';

import WebsocketHelper from './WebsocketHelper';
import HttpFallbackHelper from './HttpFallbackHelper';
import { pathOrString } from '../../utils/typeChecker';
import { pushTickManagerSetShouldTickForFields } from './PushableDefault/PushTickManager/actions';

/*
 * Selector.
 */
export const getPushableFields = (state) => state.pushManager.pushableFields;
export const getPushData = (state) => state.pushManager.pushData;

export function* addSubscription(action) {
  yield put(pushManagerUpdateStoreState(action.field, action.identifierProperty));
  yield put(pushManagerUpdateSubscriptions());
}

export function* updateSubscriptions() {
  yield put(pushManagerSubmitSubscriptions());
}

export function* submitSubscriptions() {
  yield put(pushManagerWebsocketEstablishConnection());
}

export function* receivedMessage(action) {
  const pushableFields = yield select(getPushableFields);
  if (pushableFields && Object.keys(pushableFields).length > 0) {
    yield put(pushManagerUpdateStoreStateReceivedMessage(action.message));
    // @TODO: Track tick only if should track tick
    yield put(pushManagerTrackTick(action.message));
  } else {
    yield WebsocketHelper.closeWebsocketConnection();
    yield HttpFallbackHelper.closeHttpConnection();
    yield put(pushManagerClearPushData());
  }
}

export function* websocketConnectionFailure(action) {
  Logger.error('PUSH_MANAGER', 'WEBSOCKET CONNECTION FAILURE ACTION', action);
  yield put(pushManagerHttpEstablishConnection());
}

export function* httpConnectionFailure(action) {
  yield Logger.error('PUSH_MANAGER', 'HTTP CONNECTION FAILURE ACTION', action);
}

export default function* websocketSaga() {
  const pushableFields = yield select(getPushableFields);
  Logger.debug('PUSH_MANAGER', 'Selecting PushableFields to be subscribed', pushableFields);
  const channel = yield call(WebsocketHelper.websocketInitChannel, pushableFields);
  while (true) {
    try {
      const action = yield take(channel);
      yield put(action);
    } catch (e) {
      yield put(pushManagerWebsocketConnectionFailure(e));
    }
  }
}

export function* httpSaga() {
  const pushableFields = yield select(getPushableFields);
  const channel = yield call(HttpFallbackHelper.httpFallbackInit, pushableFields);
  while (true) {
    try {
      const action = yield take(channel);
      yield put(action);
    } catch (e) {
      yield put(pushManagerHttpConnectionFailure(e));
    }
  }
}

export function* receivedErrorMessage(action) {
  const errorMessageType = pathOrString('', ['message', 'error', 'type'], action);
  const errorMessage = pathOrString('', ['message', 'error', 'message'], action);
  yield Logger.error(`Websocket error: of type "${errorMessageType}" with error: "${errorMessage}"`, action.message);
}

export function* trackTick(action) {
  if (action.message && Object.keys(action.message).length) {
    yield put(pushTickManagerSetShouldTickForFields(action.message, true));
  }
}

export const pushManagerSagas = [
  takeEvery(PUSH_MANAGER_ADD_SUBSCRIPTION, addSubscription),
  debounce(1000, PUSH_MANAGER_UPDATE_SUBSCRIPTIONS, updateSubscriptions),
  takeEvery(PUSH_MANAGER_SUBMIT_SUBSCRIPTIONS, submitSubscriptions),
  throttle(1000, PUSH_MANAGER_WEBSOCKET_ESTABLISH_CONNECTION, websocketSaga),
  throttle(1000, PUSH_MANAGER_HTTP_ESTABLISH_CONNECTION, httpSaga),
  takeEvery(PUSH_MANAGER_WEBSOCKET_CONNECTION_FAILURE, websocketConnectionFailure),
  takeEvery(PUSH_MANAGER_HTTP_CONNECTION_FAILURE, httpConnectionFailure),
  throttle(1, PUSH_MANAGER_RECEIVED_MESSAGE, receivedMessage),
  takeEvery(PUSH_MANAGER_RECEIVED_ERROR_MESSAGE, receivedErrorMessage),
  takeEvery(PUSH_MANAGER_TRACK_TICK, trackTick),
];
