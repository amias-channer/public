import { ErrorCodes } from '../../models/app-error';
import isAppError from '../../services/app-error/is-app-error';
export default function isAccountIncompleteError(error) {
    return isAppError(error) && error.code === ErrorCodes.ACCOUNT_INCOMPLETE;
}
//# sourceMappingURL=is-account-incomplete-error.js.map