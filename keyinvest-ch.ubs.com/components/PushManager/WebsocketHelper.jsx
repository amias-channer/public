import { eventChannel, END } from 'redux-saga';
import Logger from '../../utils/logger';
import {
  pushManagerReceivedErrorMessage,
  pushManagerReceivedMessage,
  pushManagerWebsocketEstablishConnection,
} from './actions';
import {
  generateSubscriptionMessage,
  generateUnsubscriptionMessage,
  getApplicationFromConfig,
  getUserFromConfig,
  getNewEndpoint,
  getPushWebsocketEndpointsFromConfig,
} from './pushManager.helper';

const NUMBER_ATTEMPTS_AFTER_ERROR = 10;

const WebsocketHelper = {
  ws: undefined,
  currentChannelId: undefined,
  websocketEndpointIndex: undefined,
  remainingWebsocketConnectionAttempts: NUMBER_ATTEMPTS_AFTER_ERROR,

  resetErrorAttempts() {
    WebsocketHelper.remainingWebsocketConnectionAttempts = NUMBER_ATTEMPTS_AFTER_ERROR;
  },
  sendSubscribeMessage(pushableFields) {
    try {
      if (WebsocketHelper.ws) {
        const subscriptionMessage = generateSubscriptionMessage(
          getApplicationFromConfig(),
          getUserFromConfig(),
          pushableFields,
        );
        if (subscriptionMessage) {
          Logger.debug('PUSH_MANAGER', 'WEBSOCKET', 'Sending subscription message', subscriptionMessage);
          WebsocketHelper.ws.send(JSON.stringify(subscriptionMessage));
          WebsocketHelper.resetErrorAttempts();
        }
      }
    } catch (e) {
      Logger.error('PUSH_MANAGER', 'WEBSOCKET', 'Error while sending subscribe message', e);
    }
  },

  sendUnsubscribeMessage() {
    try {
      if (WebsocketHelper.ws) {
        const unsubscriptionMessage = generateUnsubscriptionMessage(
          getApplicationFromConfig(),
          getUserFromConfig(),
          WebsocketHelper.currentChannelId,
        );
        if (unsubscriptionMessage) {
          Logger.debug('PUSH_MANAGER', 'WEBSOCKET', 'Sending Unsubscription message', unsubscriptionMessage);
          WebsocketHelper.ws.send(JSON.stringify(unsubscriptionMessage));
        }
      }
    } catch (e) {
      Logger.error('PUSH_MANAGER', 'WEBSOCKET', 'Error while sending unsubscribe message', e);
    }
  },

  closeWebsocketConnection() {
    if (WebsocketHelper.ws) {
      if (WebsocketHelper.ws.readyState === 1) {
        WebsocketHelper.sendUnsubscribeMessage();
      }
      try {
        Logger.debug('PUSH_MANAGER', 'WEBSOCKET', 'Closing the Websocket connection');
        WebsocketHelper.ws.close();
      } catch (e) {
        Logger.error('PUSH_MANAGER', 'WEBSOCKET', 'Error while closing the Websocket connection', e);
      }
    }
  },

  updateWsSubscription(pushableFields) {
    WebsocketHelper.sendUnsubscribeMessage();
    WebsocketHelper.sendSubscribeMessage(pushableFields);
  },

  onWebsocketError(err, emitter, pushableFields, shouldStopRetrying = false) {
    Logger.error('PUSH_MANAGER', 'WEBSOCKET', 'Failed to establish WS connection', err);
    WebsocketHelper.closeWebsocketConnection();
    WebsocketHelper.remainingWebsocketConnectionAttempts -= 1;
    if (WebsocketHelper.remainingWebsocketConnectionAttempts >= 0 && !shouldStopRetrying) {
      // Using setTimeout to handle SecurityError in IE since code must run async
      return setTimeout(() => {
        emitter(pushManagerWebsocketEstablishConnection(pushableFields));
      });
    }
    return setTimeout(() => {
      emitter(new Error(err));
      WebsocketHelper.resetErrorAttempts();
    });
  },
  openWebsocketConnection(wsEndpoint, pushableFields, emitter) {
    Logger.debug('PUSH_MANAGER', 'WEBSOCKET', 'Trying to establish WS connection to', wsEndpoint);
    try {
      if (!WebsocketHelper.ws || WebsocketHelper.ws.readyState !== 1) {
        if (pushableFields && Object.keys(pushableFields).length > 0) {
          WebsocketHelper.ws = new WebSocket(wsEndpoint);
        }
      } else if (pushableFields && Object.keys(pushableFields).length > 0) {
        WebsocketHelper.updateWsSubscription(pushableFields);
      } else {
        WebsocketHelper.closeWebsocketConnection();
      }
    } catch (err) {
      WebsocketHelper.onWebsocketError(err, emitter, pushableFields);
    }
  },

  onmessage(e, emitter) {
    let msg = null;
    try {
      msg = JSON.parse(e.data);

      if (msg && msg[0] && msg[0].id) {
        return emitter(pushManagerReceivedMessage(msg));
      }
      if (msg && msg.subscribe && msg.subscribe.channelId) {
        WebsocketHelper.currentChannelId = msg.subscribe.channelId;
      }
      if (msg && msg.error) {
        return emitter(pushManagerReceivedErrorMessage(msg));
      }
    } catch (err) {
      Logger.error('PUSH_MANAGER', 'WEBSOCKET', `Error parsing on message : ${e.data}`, err);
    }
    return undefined;
  },

  websocketInitChannel(pushableFields) {
    return eventChannel((emitter) => {
      // init the connection here
      try {
        try {
          const newEndpoint = getNewEndpoint(
            getPushWebsocketEndpointsFromConfig(),
            WebsocketHelper.websocketEndpointIndex,
          );

          if (!newEndpoint) {
            WebsocketHelper.onWebsocketError('Empty list of endpoints', emitter, pushableFields, true);
          } else {
            WebsocketHelper.websocketEndpointIndex = newEndpoint.index;
            WebsocketHelper.openWebsocketConnection(
              newEndpoint.endpoint,
              pushableFields,
              emitter,
            );
          }
        } catch (e) {
          return WebsocketHelper.onWebsocketError(e, emitter, pushableFields);
        }

        if (WebsocketHelper.ws) {
          WebsocketHelper.ws.onerror = (err) => {
            WebsocketHelper.onWebsocketError(err, emitter, pushableFields);
          };

          WebsocketHelper.ws.onopen = () => {
            Logger.debug('PUSH_MANAGER', 'WEBSOCKET', 'Websocket connection is OPEN');
            WebsocketHelper.sendSubscribeMessage(pushableFields);
          };

          WebsocketHelper.ws.onclose = () => {
            Logger.debug('PUSH_MANAGER', 'WEBSOCKET', 'Websocket connection is CLOSED');
          };

          WebsocketHelper.ws.onmessage = (e) => {
            WebsocketHelper.onmessage(e, emitter);
          };
        }
      } catch (e) {
        WebsocketHelper.onWebsocketError(e, emitter, pushableFields);
      }

      // unsubscribe function
      return () => {
        WebsocketHelper.closeWebsocketConnection();
        emitter(END);
      };
    });
  },
};

export default WebsocketHelper;
