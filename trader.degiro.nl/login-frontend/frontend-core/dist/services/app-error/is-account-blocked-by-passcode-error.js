import { ErrorCodes } from '../../models/app-error';
import isAppError from '../../services/app-error/is-app-error';
export default function isAccountBlockedByPassCodeError(error) {
    return isAppError(error) && error.code === ErrorCodes.ACCOUNT_BLOCKED_PASS_CODE;
}
//# sourceMappingURL=is-account-blocked-by-passcode-error.js.map