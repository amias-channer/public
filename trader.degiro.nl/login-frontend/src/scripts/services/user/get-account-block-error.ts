import {AppError} from 'frontend-core/dist/models/app-error';

export default function getAccountBlockError(): AppError {
    return new AppError({
        text: 'login.loginForm.errors.accountBlocked'
    });
}
