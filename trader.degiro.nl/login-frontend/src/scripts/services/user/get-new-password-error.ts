import {ErrorCodes, AppError} from 'frontend-core/dist/models/app-error';

const newPasswordErrorStatuses: string[] = ['newPasswordSameAsUsername'];

export default function getNewPasswordError(error?: AppError): AppError {
    let code: string = (error && error.code) || '';

    if (newPasswordErrorStatuses.indexOf(code) < 0) {
        code = 'invalidNewPassword';
    }

    return new AppError({
        errors: [
            {
                field: 'newPassword',
                code: ErrorCodes.VALIDATION,
                text: `passwordReset.passwordResetForm.errors.${code}`
            }
        ]
    });
}
