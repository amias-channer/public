import {ErrorLoggerCaptureOptions, logErrorRemotely} from 'frontend-core/dist/loggers/remote-logger';
import {AppError} from 'frontend-core/dist/models/app-error';
import isAppError from 'frontend-core/dist/services/app-error/is-app-error';

/**
 * @todo Remove this function when BE adds their own logger for order validation
 * @description log all 5xx errors from BE with order context data to Sentry
 * @param {Error|AppError} error
 * @param {object} data
 * @returns {void}
 */
export default function trackOrderError(error: Error | AppError, data?: ErrorLoggerCaptureOptions['metadata']) {
    if (!isAppError(error)) {
        return;
    }
    const {httpStatus = 0, text} = error;

    // track only 5xx errors
    if (httpStatus < 500 || httpStatus > 599) {
        return;
    }

    logErrorRemotely(new Error(`OrderError${text ? `: ${text}` : ''}`), {
        errorGroups: ['OrderError'],
        metadata: data
    });
}
