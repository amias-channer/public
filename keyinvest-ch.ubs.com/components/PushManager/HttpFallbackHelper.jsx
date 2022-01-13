import { eventChannel, END } from 'redux-saga';
import Logger from '../../utils/logger';
import {
  generateSubscriptionMessage,
  generateUnsubscriptionMessage,
  getApplicationFromConfig,
  getUserFromConfig,
  getNewEndpoint,
  getPushHttpEndpointsFromConfig,
  getPushHttpEndpointByIndex,
} from './pushManager.helper';
import {
  pushManagerHttpEstablishConnection,
  pushManagerReceivedMessage,
} from './actions';
import HttpService from '../../utils/httpService';

const INITIAL_ERROR_ATTEMPTS_COUNTER = 10;
const intervalPullTimeout = 2000;

const HttpFallbackHelper = {

  remainingErrorAttempts: INITIAL_ERROR_ATTEMPTS_COUNTER,
  currentChannelId: undefined,
  httpEndpointIndex: undefined,
  intervalRef: undefined,

  resetErrorAttempts: () => {
    HttpFallbackHelper.remainingErrorAttempts = INITIAL_ERROR_ATTEMPTS_COUNTER;
  },
  onmessage: (msg, emitter) => {
    try {
      if (msg && msg[0] && msg[0].id) {
        return emitter(pushManagerReceivedMessage(msg));
      }
      if (msg && msg.subscribe && msg.subscribe.channelId) {
        HttpFallbackHelper.currentChannelId = msg.subscribe.channelId;
        Logger.debug('PUSH_MANAGER', 'HTTP', `Setting the currentChannelId : ${HttpFallbackHelper.currentChannelId}`);
      }
    } catch (err) {
      Logger.error('PUSH_MANAGER', 'HTTP', `Error on message : ${msg}`, err);
    }
    return undefined;
  },
  sendSubscribeMessage(pushableFields) {
    try {
      const subscriptionMessage = generateSubscriptionMessage(
        getApplicationFromConfig(),
        getUserFromConfig(),
        pushableFields,
      );
      if (subscriptionMessage) {
        Logger.debug('PUSH_MANAGER', 'HTTP', 'Sending subscription message', subscriptionMessage);
        return HttpService.fetch(`${getPushHttpEndpointByIndex(HttpFallbackHelper.httpEndpointIndex)}/version/1`, {
          method: 'POST',
          body: JSON.stringify(subscriptionMessage),
        });
      }
    } catch (e) {
      Logger.error('PUSH_MANAGER', 'HTTP', 'Error while sending subscribe message', e);
    }

    return null;
  },
  sendUnsubscribeMessage() {
    try {
      const unsubscriptionMessage = generateUnsubscriptionMessage(
        getApplicationFromConfig(),
        getUserFromConfig(),
        HttpFallbackHelper.currentChannelId,
      );
      if (unsubscriptionMessage) {
        Logger.debug('PUSH_MANAGER', 'HTTP', 'Sending unsubscription message', unsubscriptionMessage);
        return HttpService.fetch(`${getPushHttpEndpointByIndex(HttpFallbackHelper.httpEndpointIndex)}/version/1`, {
          method: 'POST',
          body: JSON.stringify(unsubscriptionMessage),
        });
      }
    } catch (e) {
      Logger.error('PUSH_MANAGER', 'HTTP', 'Error while sending subscribe message', e);
    }

    return null;
  },
  closeHttpConnection() {
    try {
      if (HttpFallbackHelper.currentChannelId) {
        Logger.debug('PUSH_MANAGER', 'HTTP', 'Closing the HTTP connection');
        const sendUnsubscribePromise = HttpFallbackHelper.sendUnsubscribeMessage();
        if (sendUnsubscribePromise) {
          sendUnsubscribePromise
            .then((response) => response)
            .catch((err) => Logger.error(err))
            .finally(() => {
              HttpFallbackHelper.currentChannelId = null;
            });
        }
      }
    } catch (e) {
      Logger.debug('PUSH_MANAGER', 'HTTP', 'Error while closing the Websocket connection', e);
    }
  },
  onHttpError(err, emitter, pushableFields, shouldStopRetrying = false) {
    Logger.error('PUSH_MANAGER', 'HTTP', 'Error', err);
    HttpFallbackHelper.remainingErrorAttempts -= 1;
    if (HttpFallbackHelper.remainingErrorAttempts >= 0 && !shouldStopRetrying) {
      // Using setTimeout to handle SecurityError in IE since code must run async
      return setTimeout(() => {
        emitter(pushManagerHttpEstablishConnection(pushableFields));
      });
    }
    return setTimeout(() => {
      HttpFallbackHelper.closeHttpConnection();
      emitter(new Error(err));
      HttpFallbackHelper.resetErrorAttempts();
    });
  },
  initPullInterval(emitter, pushableFields) {
    if (HttpFallbackHelper.currentChannelId) {
      Logger.debug('PUSH_MANAGER', 'HTTP', 'Starting PULL Event to request data each', intervalPullTimeout, 'ms');
      HttpFallbackHelper.intervalRef = setInterval(() => {
        if (HttpFallbackHelper.currentChannelId) {
          HttpService.fetch(`${getPushHttpEndpointByIndex(HttpFallbackHelper.httpEndpointIndex)}/${HttpFallbackHelper.currentChannelId}?${new Date().getTime()}`, {
            method: 'GET',
            logResponse: false,
          }).then((response) => {
            HttpFallbackHelper.onmessage(response, emitter);
            HttpFallbackHelper.resetErrorAttempts();
          }).catch((err) => HttpFallbackHelper.onHttpError(err, emitter, pushableFields));
        } else {
          clearInterval(HttpFallbackHelper.intervalRef);
        }
      }, intervalPullTimeout);
    }
  },
  httpFallbackInit: (pushableFields) => eventChannel((emitter) => {
    if (!HttpFallbackHelper.currentChannelId) {
      const newEndpoint = getNewEndpoint(
        getPushHttpEndpointsFromConfig(),
        HttpFallbackHelper.httpEndpointIndex,
      );

      if (!newEndpoint) {
        HttpFallbackHelper.onHttpError('Empty list of endpoints', emitter, pushableFields, true);
      } else {
        HttpFallbackHelper.httpEndpointIndex = newEndpoint.index;
        const sendSubscribePromise = HttpFallbackHelper.sendSubscribeMessage(pushableFields);
        if (sendSubscribePromise) {
          sendSubscribePromise.then((response) => {
            HttpFallbackHelper.onmessage(response, emitter);
            HttpFallbackHelper.initPullInterval(emitter, pushableFields);
            HttpFallbackHelper.resetErrorAttempts();
          })
            .catch((err) => HttpFallbackHelper.onHttpError(err, emitter, pushableFields));
        }
      }
    }

    return () => {
      clearInterval(HttpFallbackHelper.intervalRef);
      HttpFallbackHelper.closeHttpConnection();
      emitter(END);
      Logger.debug('PUSH_MANAGER', 'HTTP', 'PULL Event listener stopped');
    };
  }),

};

export default HttpFallbackHelper;
