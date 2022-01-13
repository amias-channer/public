import {AppError} from 'frontend-core/dist/models/app-error';
import isAccountBlockedByPassCodeError from 'frontend-core/dist/services/app-error/is-account-blocked-by-passcode-error';
import isAccountBlockedError from 'frontend-core/dist/services/app-error/is-account-blocked-error';
import isPassCodeResetError from 'frontend-core/dist/services/app-error/is-pass-code-reset-error';
import isPasswordResetError from 'frontend-core/dist/services/app-error/is-password-reset-error';

/**
 * @description
 *  - [WF-1654]
 *  - If user's passcode blocked he has to login with username/password
 * @param {Error|AppError} error
 * @returns {boolean}
 */
export default function shouldResetUserByError(error: Error | AppError): error is AppError {
    return (
        isAccountBlockedError(error) ||
        isPasswordResetError(error) ||
        isPassCodeResetError(error) ||
        isAccountBlockedByPassCodeError(error)
    );
}
