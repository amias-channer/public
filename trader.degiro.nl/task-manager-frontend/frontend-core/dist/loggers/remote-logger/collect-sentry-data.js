import getPlatformMetadata from '../../platform/get-platform-metadata';
import createUUID from '../../utils/create-uuid';
import { getExceptionFingerprintFromMessage } from './error-groups';
import { unknownFunction } from './index';
const sessionStartTime = Date.now();
let lastStackInfo;
export default function collectSentryData(sentryDsnInfo, ignoreErrors, ignoreUrls, errorLoggerUser, projectRelease, stackInfo, captureOptions = {}) {
    const { message, frames = [], name: exceptionType } = stackInfo;
    const prefixedMessage = (exceptionType ? `${exceptionType}: ` : '') + message;
    const firstStackFrame = frames[0];
    const fileUrl = (firstStackFrame === null || firstStackFrame === void 0 ? void 0 : firstStackFrame.filename) || stackInfo.url;
    // skip blacklisted errors
    if (ignoreErrors.test(message) || ignoreErrors.test(prefixedMessage) || ignoreUrls.test(fileUrl)) {
        return;
    }
    // skip duplicates
    if (lastStackInfo &&
        lastStackInfo.name === stackInfo.name &&
        lastStackInfo.message === stackInfo.message &&
        lastStackInfo.url === stackInfo.url) {
        return;
    }
    lastStackInfo = stackInfo;
    let stacktrace;
    if (firstStackFrame) {
        stacktrace = {
            // Sentry expects frames oldest to newest and JS sends them as newest to oldest
            frames: frames.slice(0).reverse()
        };
    }
    else {
        stacktrace = {
            frames: [
                {
                    filename: fileUrl,
                    function: unknownFunction,
                    // eslint-disable-next-line camelcase
                    in_app: true
                }
            ]
        };
    }
    const sentryData = {
        project: sentryDsnInfo.project,
        logger: 'javascript',
        // event_id can be used to reference the error within Sentry itself.
        // eslint-disable-next-line camelcase
        event_id: createUUID().split('-').join(''),
        // sentry.interfaces.Exception
        exception: {
            values: [
                {
                    type: exceptionType ? exceptionType : message ? '' : 'Unrecoverable error caught',
                    value: message,
                    stacktrace
                }
            ],
            mechanism: {
                type: 'generic',
                handled: true,
                ...captureOptions.mechanism
            }
        },
        transaction: fileUrl,
        tags: {
            userId: errorLoggerUser && errorLoggerUser.id
        },
        extra: {
            'session:duration': Date.now() - sessionStartTime,
            ...getPlatformMetadata(),
            ...captureOptions.metadata
        },
        // sentry.interfaces.User
        user: errorLoggerUser,
        release: projectRelease
    };
    const fingerprint = [
        ...(getExceptionFingerprintFromMessage(message) || []),
        ...(captureOptions.errorGroups || [])
    ];
    if (fingerprint.length > 0) {
        sentryData.fingerprint = fingerprint;
    }
    if (typeof document !== 'undefined' && typeof navigator !== 'undefined') {
        sentryData.request = {
            url: location.href,
            headers: {
                'User-Agent': navigator.userAgent,
                Referer: document.referrer
            }
        };
    }
    return sentryData;
}
//# sourceMappingURL=collect-sentry-data.js.map