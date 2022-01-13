import { ErrorCodes } from '../../models/app-error';
import isAppError from '../../services/app-error/is-app-error';
export default function isPasswordResetError(error) {
    return isAppError(error) && error.code === ErrorCodes.PASSWORD_RESET;
}
//# sourceMappingURL=is-password-reset-error.js.map