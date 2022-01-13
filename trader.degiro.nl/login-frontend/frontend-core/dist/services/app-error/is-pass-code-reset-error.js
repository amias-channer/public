import { ErrorCodes } from '../../models/app-error';
import isAppError from '../../services/app-error/is-app-error';
export default function isPassCodeResetError(error) {
    return isAppError(error) && error.code === ErrorCodes.PASS_CODE_RESET;
}
//# sourceMappingURL=is-pass-code-reset-error.js.map