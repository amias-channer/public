import { logErrorLocally } from '../../loggers/local-logger';
import isAppError from '../../services/app-error/is-app-error';
import isHttpAuthError from '../../services/app-error/is-http-auth-error';
import cleanupUrl from '../../utils/url/cleanup-url';
import getQueryString from '../../utils/url/get-query-string';
import isUsPersonError from '../app-error/is-us-person-error';
import logout from '../user/logout';
import redirectToLoginPage from '../user/redirect-to-login-page';
import parseApiResponse from './parse-api-response';
import parseApiResponseError from './parse-api-response-error';
const pendingRequests = new Map();
export default function requestToApi(options) {
    const { config = {}, cache, responseType = 'json' } = options;
    // redirect by default to Login page from any request when session gets expired
    // redirect by default to Login page on US Person error
    const { loginUrl, tradingUrl, redirectUnauthorizedToLogin = true, redirectUsPersonToLogin = true } = config;
    const searchParams = {
        ...options.params,
        intAccount: config.intAccount,
        sessionId: config.sessionId
    };
    const isJsonResponseType = responseType === 'json';
    const { intAccount, sessionId } = searchParams;
    const queryString = getQueryString(searchParams);
    let requestUrl = options.url;
    if (queryString) {
        requestUrl += `${requestUrl.includes('?') ? '&' : '?'}${queryString}`;
    }
    const cacheOptions = {
        url: requestUrl
    };
    // this URL is used to store pending promises
    const pendingRequestUrl = cleanupUrl({
        url: requestUrl,
        ignoredSearchParams: ['sessionId'],
        ignoredPathSegments: ['jsessionid']
    });
    return Promise.resolve(cache && cache.get(cacheOptions))
        .catch((error) => logErrorLocally('ResourceCache get error', { requestUrl, error }))
        .then((cachedResponse) => {
        if (cachedResponse) {
            // Important: clone response to prevent "body in use" error
            return { responseToRead: cachedResponse.clone() };
        }
        let pendingRequest = pendingRequests.get(pendingRequestUrl);
        if (!pendingRequest) {
            const headers = {
                Accept: 'application/json, text/plain, */*'
            };
            const fetchInit = {
                method: options.method || 'GET',
                mode: options.mode || 'cors',
                credentials: options.credentials || 'include'
            };
            const { body } = options;
            const { method: fetchMethod } = fetchInit;
            // fix BE bug. Tomcat requires 'Content-Type' for POST/PUT requests even with empty body
            if (body || fetchMethod === 'POST' || fetchMethod === 'PUT') {
                headers['Content-Type'] = 'application/json;charset=UTF-8';
                fetchInit.body = JSON.stringify(body || {});
            }
            fetchInit.headers = {
                ...headers,
                ...options.headers
            };
            pendingRequest = fetch(requestUrl, fetchInit);
            // prevent sending same parallel requests, but only GET, because other types might modify BE state
            if (fetchMethod === 'GET') {
                // [SENTRY-914] pending request will get many consumers of the response (see next .then callback),
                // that's why response should be cloned to prevent an error during the reading of consumed body,
                // e.g. see iOS 10-11.x "Cannot consume a disturbed Response body ReadableStream" error
                // IMPORTANT: add additional clone resolve only when it's needed and
                // not for every request (performance in WebKit)
                pendingRequest = pendingRequest.then((response) => response.clone());
                pendingRequests.set(pendingRequestUrl, pendingRequest);
            }
        }
        return pendingRequest.then((response) => {
            // remove finished pending request
            pendingRequests.delete(pendingRequestUrl);
            if (response.ok) {
                try {
                    // Important: clone response to prevent "body in use" error
                    return {
                        responseToRead: response.clone(),
                        // if cache is not used, do not create unnecessary response clone (performance in WebKit)
                        responseToCache: cache && response.clone()
                    };
                }
                catch (_a) {
                    // [SENTRY-865]: iOS 11.X doesn't allow to clone responses with an error
                    // "Cannot clone a disturbed Response",
                    // https://bugs.webkit.org/show_bug.cgi?id=171552,
                    // https://github.com/github/fetch/issues/504
                    // So if it happens, we return an origin response and nothing to cache, because
                    // cache should work ONLY WITH CLONED Response instance
                    return { responseToRead: response };
                }
            }
            // server could answer to us with error details
            return (response
                .json()
                // resolve empty error details
                .catch(() => undefined)
                .then((errorDetails = {}) => {
                return Promise.reject(parseApiResponseError(response, errorDetails));
            }));
        });
    })
        .then(({ responseToRead, responseToCache }) => {
        const readPromise = isJsonResponseType ? responseToRead.json() : responseToRead.text();
        return readPromise.then((responseModel) => ({ responseToCache, responseModel }));
    })
        .then(({ responseToCache, responseModel }) => {
        // Error details can be in HTTP 200 response.
        // TODO: fix such responses on BE, error response should have a proper HTTP status
        const parsedResponse = parseApiResponse(responseModel);
        if (isAppError(parsedResponse)) {
            return Promise.reject(parsedResponse);
        }
        return Promise.resolve(cache &&
            responseToCache &&
            cache.set({
                ...cacheOptions,
                intAccount,
                response: responseToCache,
                parsedResponse
            }))
            .catch((error) => logErrorLocally('ResourceCache set error', { requestUrl, error }))
            .then(() => parsedResponse);
    })
        .catch((responseError) => {
        // removed failed pending request
        pendingRequests.delete(pendingRequestUrl);
        if (redirectUnauthorizedToLogin && loginUrl && isHttpAuthError(responseError)) {
            redirectToLoginPage({ loginUrl });
        }
        else if (redirectUsPersonToLogin && loginUrl && isUsPersonError(responseError)) {
            return Promise.resolve()
                .then(() => tradingUrl && sessionId && logout({ tradingUrl, sessionId }))
                .catch((error) => logErrorLocally('US Person logout error', { error }))
                .then(() => {
                redirectToLoginPage({ loginUrl }, {
                    params: {
                        reason: 'us_person'
                    }
                });
                return Promise.reject(responseError);
            });
        }
        return Promise.reject(responseError);
    });
}
//# sourceMappingURL=request-to-api.js.map