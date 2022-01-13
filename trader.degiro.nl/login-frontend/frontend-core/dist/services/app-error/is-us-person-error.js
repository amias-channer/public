import { ErrorCodes } from '../../models/app-error';
import isAppError from './is-app-error';
export default function isUsPersonError(error) {
    return isAppError(error) && error.code === ErrorCodes.US_PERSON;
}
//# sourceMappingURL=is-us-person-error.js.map