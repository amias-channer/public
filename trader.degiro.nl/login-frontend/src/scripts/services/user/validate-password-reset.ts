import {ErrorCodes, AppError} from 'frontend-core/dist/models/app-error';
import {PasswordResetData} from '../../models/user';
import getPasswordResetEmailError from './get-password-reset-email-error';

export default function validatePasswordReset(data: PasswordResetData): AppError | undefined {
    if (!data.username) {
        return new AppError({
            errors: [
                {
                    field: 'username',
                    code: ErrorCodes.VALIDATION,
                    text: 'passwordReset.passwordResetForm.errors.invalidUsername'
                }
            ]
        });
    }

    if (!data.email) {
        return getPasswordResetEmailError();
    }
}
