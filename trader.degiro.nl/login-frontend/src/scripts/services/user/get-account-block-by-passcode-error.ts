import {AppError} from 'frontend-core/dist/models/app-error';

export default function getAccountBlockByPassCodeError(): AppError {
    return new AppError({
        text: 'login.loginForm.errors.accountBlockedPassCode'
    });
}
