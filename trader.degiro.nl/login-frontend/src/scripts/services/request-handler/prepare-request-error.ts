import {AppError, ErrorCodes} from 'frontend-core/dist/models/app-error';
import {I18n} from 'frontend-core/dist/models/i18n';
import isAccountBlockedByPassCodeError from 'frontend-core/dist/services/app-error/is-account-blocked-by-passcode-error';
import isAccountBlockedError from 'frontend-core/dist/services/app-error/is-account-blocked-error';
import isAccountIncompleteError from 'frontend-core/dist/services/app-error/is-account-incomplete-error';
import isLoginFailuresError from 'frontend-core/dist/services/app-error/is-login-failures-error';
import isPassCodeResetError from 'frontend-core/dist/services/app-error/is-pass-code-reset-error';
import isPasswordResetError from 'frontend-core/dist/services/app-error/is-password-reset-error';
import getAccountBlockByPassCodeError from '../user/get-account-block-by-passcode-error';
import getAccountBlockError from '../user/get-account-block-error';
import getAccountIncompleteError from '../user/get-account-incomplete-error';
import getLoginFailuresError from '../user/get-login-failures-error';
import getNewPasswordConfirmationError from '../user/get-new-password-confirmation-error';
import getNewPasswordError from '../user/get-new-password-error';
import getPassCodeResetError from '../user/get-passcode-reset-error';
import getPasswordResetEmailError from '../user/get-password-reset-email-error';
import getPasswordResetError from '../user/get-password-reset-error';

export default function prepareRequestError(i18n: I18n, error: AppError): AppError {
    const {code} = error;

    if (isLoginFailuresError(error)) {
        error = getLoginFailuresError(i18n, error);
    } else if (isAccountBlockedByPassCodeError(error)) {
        error = getAccountBlockByPassCodeError();
    } else if (isAccountBlockedError(error)) {
        error = getAccountBlockError();
    } else if (isAccountIncompleteError(error)) {
        error = getAccountIncompleteError();
    } else if (isPasswordResetError(error)) {
        error = getPasswordResetError();
    } else if (isPassCodeResetError(error)) {
        error = getPassCodeResetError();
    } else {
        switch (code) {
            case ErrorCodes.EMAIL_DOES_NOT_MATCH:
                error = getPasswordResetEmailError();
                break;
            case ErrorCodes.NEW_PASSWORD_SAME_AS_USERNAME:
                error = getNewPasswordError(error);
                break;
            case ErrorCodes.CONFIRMATION_PASSWORD_DOES_NOT_MATCH:
                error = getNewPasswordConfirmationError();
                break;
            default:
            //
        }
    }

    // save the original data
    if (code) {
        error.code = code;
    }

    return error;
}
