import {ErrorCodes, AppError} from 'frontend-core/dist/models/app-error';

export default function getPasswordResetEmailError(): AppError {
    return new AppError({
        errors: [
            {
                field: 'email',
                code: ErrorCodes.VALIDATION,
                text: 'passwordReset.passwordResetForm.errors.invalidEmail'
            }
        ]
    });
}
