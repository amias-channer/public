import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {I18n} from 'frontend-core/dist/models/i18n';
import {AppError} from 'frontend-core/dist/models/app-error';
import isAppError from 'frontend-core/dist/services/app-error/is-app-error';
import prepareRequestError from './prepare-request-error';

export default function createRequestErrorHandler(i18n: I18n) {
    return (error: Error | AppError) => {
        const {code, text, message} = error as AppError;

        logErrorLocally({code, text, message}, error);

        return Promise.reject(isAppError(error) ? prepareRequestError(i18n, error) : error);
    };
}
