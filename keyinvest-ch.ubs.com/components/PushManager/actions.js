import { IDENTIFIER_PROPERTY } from './PushableDefault/PushableDefault.helper';

export const PUSH_MANAGER_ADD_SUBSCRIPTION = 'PushManager/PUSH_MANAGER_ADD_SUBSCRIPTION';
export const PUSH_MANAGER_REMOVE_SUBSCRIPTION = 'PushManager/PUSH_MANAGER_REMOVE_SUBSCRIPTION';
export const PUSH_MANAGER_UPDATE_SUBSCRIPTIONS = 'PushManager/PUSH_MANAGER_UPDATE_SUBSCRIPTIONS';
export const PUSH_MANAGER_SUBMIT_SUBSCRIPTIONS = 'PushManager/PUSH_MANAGER_SUBMIT_SUBSCRIPTIONS';
export const PUSH_MANAGER_UPDATE_STORE_STATE = 'PushManager/PUSH_MANAGER_UPDATE_STORE_STATE';

export const PUSH_MANAGER_RECEIVED_MESSAGE = 'PushManager/PUSH_MANAGER_RECEIVED_MESSAGE';
export const PUSH_MANAGER_UPDATE_STORE_STATE_RECEIVED_MESSAGE = 'PushManager/PUSH_MANAGER_UPDATE_STORE_STATE_RECEIVED_MESSAGE';
export const PUSH_MANAGER_WEBSOCKET_ESTABLISH_CONNECTION = 'PushManager/PUSH_MANAGER_WEBSOCKET_ESTABLISH_CONNECTION';
export const PUSH_MANAGER_WEBSOCKET_CONNECTION_FAILURE = 'PushManager/PUSH_MANAGER_WEBSOCKET_CONNECTION_FAILURE';

export const PUSH_MANAGER_HTTP_ESTABLISH_CONNECTION = 'PushManager/PUSH_MANAGER_HTTP_ESTABLISH_CONNECTION';
export const PUSH_MANAGER_HTTP_CONNECTION_FAILURE = 'PushManager/PUSH_MANAGER_HTTP_CONNECTION_FAILURE';

export const PUSH_MANAGER_CLEAR_PUSH_DATA = 'PushManager/PUSH_MANAGER_CLEAR_PUSH_DATA';

export const PUSH_MANAGER_RECEIVED_ERROR_MESSAGE = 'PushManager/PUSH_MANAGER_RECEIVED_ERROR_MESSAGE';

export const PUSH_MANAGER_TRACK_TICK = 'PushManager/PUSH_MANAGER_TRACK_TICK';

export function pushManagerAddSubscription(
  field,
  identifierProperty = IDENTIFIER_PROPERTY,
) {
  return {
    type: PUSH_MANAGER_ADD_SUBSCRIPTION,
    field,
    identifierProperty,
  };
}

export function pushManagerRemoveSubscription(field, identifierProperty = IDENTIFIER_PROPERTY) {
  return {
    type: PUSH_MANAGER_REMOVE_SUBSCRIPTION,
    field,
    identifierProperty,
  };
}

export function pushManagerUpdateSubscriptions() {
  return {
    type: PUSH_MANAGER_UPDATE_SUBSCRIPTIONS,
  };
}

export function pushManagerSubmitSubscriptions() {
  return {
    type: PUSH_MANAGER_SUBMIT_SUBSCRIPTIONS,
  };
}

export function pushManagerUpdateStoreState(
  field,
  identifierProperty = IDENTIFIER_PROPERTY,
) {
  return {
    type: PUSH_MANAGER_UPDATE_STORE_STATE,
    field,
    identifierProperty,
  };
}

export function pushManagerUpdateStoreStateReceivedMessage(message) {
  return {
    type: PUSH_MANAGER_UPDATE_STORE_STATE_RECEIVED_MESSAGE,
    message,
  };
}

export function pushManagerReceivedMessage(message) {
  return {
    type: PUSH_MANAGER_RECEIVED_MESSAGE,
    message,
  };
}

export function pushManagerWebsocketConnectionFailure(message) {
  return {
    type: PUSH_MANAGER_WEBSOCKET_CONNECTION_FAILURE,
    message,
  };
}

export function pushManagerClearPushData() {
  return {
    type: PUSH_MANAGER_CLEAR_PUSH_DATA,
  };
}

export function pushManagerWebsocketEstablishConnection() {
  return {
    type: PUSH_MANAGER_WEBSOCKET_ESTABLISH_CONNECTION,
  };
}

export function pushManagerHttpEstablishConnection() {
  return {
    type: PUSH_MANAGER_HTTP_ESTABLISH_CONNECTION,
  };
}

export function pushManagerHttpConnectionFailure(message) {
  return {
    type: PUSH_MANAGER_HTTP_CONNECTION_FAILURE,
    message,
  };
}

export function pushManagerReceivedErrorMessage(message) {
  return {
    type: PUSH_MANAGER_RECEIVED_ERROR_MESSAGE,
    message,
  };
}

export function pushManagerTrackTick(message) {
  return {
    type: PUSH_MANAGER_TRACK_TICK,
    message,
  };
}
