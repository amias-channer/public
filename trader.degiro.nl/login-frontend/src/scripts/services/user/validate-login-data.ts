import {AppError, ErrorCodes, PlainAppError} from 'frontend-core/dist/models/app-error';
import {PasswordLoginParams} from '../../models/user';

type LoginData = Pick<PasswordLoginParams, 'username' | 'password'>;

export default function validateLoginData(data: LoginData): AppError | undefined {
    const errors: PlainAppError[] = [];

    if (!data.username) {
        errors.push({
            field: 'username',
            code: ErrorCodes.VALIDATION,
            text: 'errors.field.required'
        });
    }

    if (!data.password) {
        errors.push({
            field: 'password',
            code: ErrorCodes.VALIDATION,
            text: 'errors.field.required'
        });
    }

    if (errors.length) {
        return new AppError({errors});
    }
}
