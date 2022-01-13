import { ErrorCodes } from '../../models/app-error';
import isAppError from '../../services/app-error/is-app-error';
export default function isAccountBlockedError(error) {
    return isAppError(error) && error.code === ErrorCodes.ACCOUNT_BLOCKED;
}
//# sourceMappingURL=is-account-blocked-error.js.map