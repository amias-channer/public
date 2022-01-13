import {AppError} from 'frontend-core/dist/models/app-error';

export default function getAccountIncompleteError(): AppError {
    return new AppError({
        text: 'login.loginForm.errors.accountIncomplete'
    });
}
