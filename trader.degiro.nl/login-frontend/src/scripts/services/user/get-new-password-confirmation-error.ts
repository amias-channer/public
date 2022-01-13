import {ErrorCodes, AppError} from 'frontend-core/dist/models/app-error';

export default function getNewPasswordConfirmationError(): AppError {
    return new AppError({
        errors: [
            {
                field: 'newPasswordConfirmation',
                code: ErrorCodes.VALIDATION,
                text: 'passwordReset.passwordResetForm.errors.confirmationPasswordDoesNotMatch'
            }
        ]
    });
}
