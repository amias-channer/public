import { ErrorCodes } from '../../models/app-error';
import isAppError from './is-app-error';
/**
 * @description Check if error is only a container for child errors list
 * @param {PlainAppError|AppError|Error} error
 * @returns {boolean}
 */
export default function isHttpAuthError(error) {
    return isAppError(error) && error.code === ErrorCodes.HTTP_AUTH;
}
//# sourceMappingURL=is-http-auth-error.js.map