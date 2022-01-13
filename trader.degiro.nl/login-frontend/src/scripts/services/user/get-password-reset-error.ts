import {AppError} from 'frontend-core/dist/models/app-error';

export default function getPasswordResetError(): AppError {
    return new AppError({
        text: 'login.loginForm.errors.passwordReset'
    });
}
