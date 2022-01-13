import {I18n} from 'frontend-core/dist/models/i18n';
import {LoginFailuresError, AppError} from 'frontend-core/dist/models/app-error';
import localize from 'frontend-core/dist/services/i18n/localize';

export default function getLoginFailuresError(i18n: I18n, error: LoginFailuresError): AppError {
    return new AppError({
        // save error props such as loginFailures, statusText, etc.
        ...error,
        text: localize(i18n, 'login.loginForm.errors.loginFailuresWarning', {
            loginFailures: error.loginFailures
        })
    });
}
