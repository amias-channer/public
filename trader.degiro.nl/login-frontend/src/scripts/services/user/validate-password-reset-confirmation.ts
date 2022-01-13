import {AppError} from 'frontend-core/dist/models/app-error';
import {PasswordResetConfirmationData} from '../../models/user';
import getNewPasswordConfirmationError from './get-new-password-confirmation-error';
import getNewPasswordError from './get-new-password-error';

export default function validatePasswordResetConfirmation(data: PasswordResetConfirmationData): AppError | undefined {
    if (!data.newPassword) {
        return getNewPasswordError();
    }

    if (data.newPasswordConfirmation !== data.newPassword) {
        return getNewPasswordConfirmationError();
    }
}
