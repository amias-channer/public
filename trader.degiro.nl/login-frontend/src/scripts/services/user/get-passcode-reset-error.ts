import {AppError} from 'frontend-core/dist/models/app-error';

export default function getPassCodeResetError(): AppError {
    return new AppError({
        text: 'login.loginForm.errors.passCodeReset'
    });
}
