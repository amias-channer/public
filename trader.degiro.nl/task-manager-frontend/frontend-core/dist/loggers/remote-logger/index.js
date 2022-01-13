import isDomError from '../../utils/is-dom-error';
import isDomException from '../../utils/is-dom-exception';
import isError from '../../utils/is-error';
import isErrorEvent from '../../utils/is-error-event';
import isObject from '../../utils/is-object';
import joinRegExp from '../../utils/join-reg-exp';
import stringifyException from '../../utils/stringify-exception';
import { logWarningLocally } from '../local-logger';
import collectSentryData from './collect-sentry-data';
import computeStackTrace from './compute-stack-trace';
import errorsBlacklist from './errors-blacklist';
import parseSentryDsn from './parse-sentry-dsn';
import sendSentryData from './send-sentry-data';
import serializeException from './serialize-exception';
import urlsBlacklist from './urls-blacklist';
// Sentry API specific
export const unknownFunction = '?';
let sentryDsnInfo;
let errorLoggerUser;
let projectRelease;
let ignoreErrors;
let ignoreUrls;
function processException(exception, captureOptions) {
    let error;
    if (isErrorEvent(exception)) {
        error = new Error(stringifyException(exception.error || exception));
    }
    else if (isDomError(exception) || isDomException(exception)) {
        const domException = exception;
        const errorName = exception.name || (isDomError(exception) ? 'DOMError' : 'DOMException');
        error = new Error(domException.message ? `${errorName}:${domException.message}` : errorName);
    }
    else if (isError(exception)) {
        error = exception;
    }
    else if (isObject(exception)) {
        error = new Error(JSON.stringify(serializeException(exception)));
    }
    else {
        error = new Error(String(exception));
    }
    const stackInfo = computeStackTrace(error);
    const sentryData = collectSentryData(sentryDsnInfo, ignoreErrors, ignoreUrls, errorLoggerUser, projectRelease, stackInfo, captureOptions);
    if (sentryData) {
        sendSentryData(sentryDsnInfo, sentryData);
    }
}
export function initRemoteLogger(options) {
    const { dsn } = options;
    // possible case when we re-init Worker
    if (sentryDsnInfo) {
        logWarningLocally('Error logger is already initialized');
        return;
    }
    if (!dsn) {
        logWarningLocally('Error logger DSN is missing');
        return;
    }
    projectRelease = options.release;
    sentryDsnInfo = parseSentryDsn(dsn);
    ignoreErrors = joinRegExp(errorsBlacklist.concat([/^Script error\.?$/, /^Javascript error: Script error\.? on line 0$/]), 'i');
    ignoreUrls = joinRegExp(urlsBlacklist, 'i');
    self.addEventListener('error', (event) => {
        processException(event, {
            mechanism: {
                type: 'onerror',
                handled: false
            }
        });
    }, false);
    self.addEventListener('unhandledrejection', (event) => {
        processException(event.reason, {
            mechanism: {
                type: 'onunhandledrejection',
                handled: false
            }
        });
    }, false);
}
export function setRemoteLoggerUser(user) {
    errorLoggerUser = user && { ...user };
}
export function logErrorRemotely(exception, options) {
    if (!sentryDsnInfo) {
        logWarningLocally('Error logger is not initialized');
        return;
    }
    processException(exception, options);
}
//# sourceMappingURL=index.js.map