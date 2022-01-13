import { uniq } from 'ramda';
import Logger from '../../utils/logger';
import getAppConfig from '../../main/AppConfig';

export const getPushHttpEndpointsFromConfig = () => getAppConfig().pushHttpFallbackEndpoints;
export const getPushWebsocketEndpointsFromConfig = () => getAppConfig().pushWebsocketEndpoints;
export const getApplicationFromConfig = () => getAppConfig().application;
export const getUserFromConfig = () => getAppConfig().user;
export const getPushHttpEndpointByIndex = (index) => getPushHttpEndpointsFromConfig()[index];

export function getNewEndpoint(listEndpoints, previousIndex) {
  if (listEndpoints && listEndpoints.length) {
    let index = previousIndex;
    if (index === undefined) {
      index = Math.floor(Math.random() * listEndpoints.length);
    } else {
      index += 1;
      if (index >= listEndpoints.length) {
        index = 0;
      }
    }

    return {
      endpoint: listEndpoints[index],
      index,
    };
  }
  return null;
}

export function generateSubscriptionMessage(application, user, pushableFields) {
  try {
    if (application && user && pushableFields && Object.keys(pushableFields).length) {
      const subscribeStrings = [];
      Object.keys(pushableFields).map((identifier) => {
        if (Object.keys(pushableFields[identifier]).length > 0) {
          return Object.keys(pushableFields[identifier]).map(
            (fieldName) => subscribeStrings.push(
              pushableFields[identifier][fieldName].pushMetaData.subscribeString,
            ),
          );
        }
        return null;
      });
      return {
        application,
        user,
        subscribe: uniq(subscribeStrings),
      };
    }
    Logger.error('PUSH_MANAGER',
      'Failed to generate subscription message',
      `Missing params: application:${application} user:${user} pushableFields:`, pushableFields);
  } catch (e) {
    Logger.error('PUSH_MANAGER', 'Failed to generate subscription message', e);
  }
  return null;
}

export function generateUnsubscriptionMessage(application, user, channelId) {
  if (application && user && channelId) {
    return {
      application,
      user,
      unsubscribe: [`channelId:${channelId}`],
    };
  }
  Logger.error('PUSH_MANAGER',
    'Failed to generate unsubscription message',
    `Missing params: application:${application} user:${user} channelId:${channelId}`);
  return null;
}
