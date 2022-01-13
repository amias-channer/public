import { ErrorCodes } from '../../models/app-error';
import isAppError from './is-app-error';
export default function isOtpRequiredError(error) {
    return isAppError(error) && error.code === ErrorCodes.TOTP_NEEDED;
}
//# sourceMappingURL=is-otp-required-error.js.map