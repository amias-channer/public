import {
  mergeRight, omit, path, pathOr,
} from 'ramda';
import axios from 'axios';
import moment from 'moment';
import Logger from './logger';
import getAppConfig from '../main/AppConfig';
import { store } from '../main/configureStore';
import {
  appendModeFlatex,
  ENV_DEV,
  generateUniqId,
  isEmptyData,
  isModeFlatex,
  isUserAgentBot,
  stringifyParams,
} from './utils';
import {
  globalErrorOccurred,
  globalSetDisclaimerStatus,
  globalUpdateProfilerBanner,
} from '../main/actions';
import {
  getObjFromQueryParams,
} from '../components/DefaultListFilterable/ProductFilters/ProductFilters.helper';
import { authSetUserLoggedOut } from '../components/Authentication/actions';

export const REQUEST_METHOD_PUT = 'PUT';
export const REQUEST_METHOD_DELETE = 'DELETE';
export const REQUEST_METHOD_POST = 'POST';
export const REQUEST_METHOD_PATCH = 'PATCH';

export const RESPONSE_STATUS_SUCCESS_CODE = 200;
export const RESPONSE_STATUS_BAD_REQUEST_CODE = 400;

export const REQUEST_HEADER_KEY_X_REQUESTED_WITH = 'X-Requested-With';
export const REQUEST_HEADER_VALUE_XML_HTTP_REQUEST = 'XMLHttpRequest';

const updateProfiler = (data) => {
  if (!window.profilerDisabled) {
    store.dispatch(globalUpdateProfilerBanner(data));
  }
};

const updateDisclaimerStatus = (required) => {
  if (!isUserAgentBot()) {
    store.dispatch(globalSetDisclaimerStatus(required));
  }
};

const isDisclaimerAcceptedOnceForSession = () => pathOr(false, ['global', 'disclaimerAcceptedForSession'], store.getState());
const isDisclaimerCurrentlyOpen = () => pathOr(false, ['global', 'showDisclaimer'], store.getState());

const updateUserAuthStatus = (isUserAuthenticated) => {
  if (isUserAuthenticated === false) {
    store.dispatch(authSetUserLoggedOut());
  }
};

const globalErrorHandler = (response) => {
  store.dispatch(globalErrorOccurred(response.status, response.message));
};

const HttpService = {

  fetch: (url, params) => {
    const request = {
      id: pathOr(generateUniqId(), ['requestId'], params),
      timestamp: pathOr(new Date().getTime(), ['requestTimestamp'], params),
      url,
      params,
    };

    const logResponse = pathOr(true, ['logResponse'], params);

    if (logResponse) {
      Logger.debug('HTTP_SERVICE', 'Request', url, params);
    }
    return new Promise((resolve, reject) => {
      axios({
        url: isModeFlatex() ? appendModeFlatex(url) : url,
        withCredentials: true,
        responseType: 'json',
        ...params,
      })
        .then((response) => {
          const isSuccessful = path(['data', 'state'], response) !== 'Error';
          const processedResponse = HttpService.processResponse(
            response,
            request,
            isSuccessful,
          );
          if (!isSuccessful) {
            Logger.error('HTTP_SERVICE', 'Failure', processedResponse);
            return reject(processedResponse);
          }
          if (logResponse) {
            Logger.debug('HTTP_SERVICE', 'Success', processedResponse);
          }
          return resolve(processedResponse);
        }, (error) => {
          try {
            const response = error.response || error.toJSON();
            const processedResponse = HttpService.processResponse(
              response,
              request,
              false,
            );
            Logger.error('HTTP_SERVICE', 'Failure', processedResponse);
            return reject(processedResponse);
          } catch (e) {
            return reject(e);
          }
        });
    });
  },

  processResponse: (response, request, isSuccessful) => {
    const precessedResponse = {
      ...pathOr({}, ['data'], response),
      ...omit(['data'], response),
      isSuccessful,
      request,
    };
    HttpService.handleResponseListeners(precessedResponse);
    return precessedResponse;
  },

  handleResponseListeners: (response) => {
    if (!response.isSuccessful && path(['request', 'params', 'pageRequest'], response)) {
      globalErrorHandler(response);
    }

    // Updating Profiler
    if (response.profiler) {
      const now = moment();
      updateProfiler({
        duration: now.diff(pathOr('', ['request', 'timestamp'], response)),
        timestamp: now,
        key: response.profiler,
        apiLink: pathOr('', ['request', 'url'], response),
      });
    }

    if (!isDisclaimerAcceptedOnceForSession() && !isDisclaimerCurrentlyOpen()) {
      /* Update Disclaimer Status only if the disclaimer is not currently
       * visible for the user and it was not accepted already during current
       * user navigation (without refreshing the page)
       */
      updateDisclaimerStatus(response.disclaimerAcceptanceRequired);
    }

    // Check User Authentication Status
    updateUserAuthStatus(response.isUserAuthenticated);
  },

  postFormData: (url, params) => {
    const postParams = {
      method: REQUEST_METHOD_POST,
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
      },
    };
    return HttpService.fetch(url, mergeRight(postParams, params));
  },

  generateUrl(pathname) {
    const appConfig = getAppConfig();
    if (appConfig.environment === ENV_DEV) {
      return `//${appConfig.hostname}${pathname || ''}`;
    }
    return pathname || '';
  },

  getPageApiUrl() {
    const appConfig = getAppConfig();
    return HttpService.generateUrl(appConfig.pageApiPath);
  },

  getBackendUrlByStateName(
    stateName,
    includeCurrentUrlQueryParams = true,
    additionalQueryParams = {},
  ) {
    const appConfig = getAppConfig();
    let pathname = appConfig.pageApiPath;
    if (stateName && appConfig.stateNameToUrl && appConfig.stateNameToUrl[stateName]) {
      pathname += appConfig.stateNameToUrl[stateName];
    } else {
      Logger.error('HTTP_SERVICE', 'StateName', stateName, 'not configured', appConfig.stateNameToUrl);
    }
    try {
      if (includeCurrentUrlQueryParams) {
        const currentQueryParamsObj = getObjFromQueryParams();
        const newQueryParamsObj = mergeRight(currentQueryParamsObj, additionalQueryParams);
        pathname += `?${stringifyParams(newQueryParamsObj)}`;
      } else if (additionalQueryParams && !isEmptyData(additionalQueryParams)) {
        pathname += `?${stringifyParams(additionalQueryParams)}`;
      }
    } catch (e) {
      Logger.error('HTTP_SERVICE', 'getBackendUrlByStateName', stateName, ' unable to append url search params', appConfig.stateNameToUrl, window.location);
    }
    return HttpService.generateUrl(pathname);
  },
};

export default HttpService;
