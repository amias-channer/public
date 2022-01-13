import { ErrorCodes } from '../../models/app-error';
import isAppError from '../../services/app-error/is-app-error';
export default function isJointAccountPersonNeededError(error) {
    return (isAppError(error) &&
        (error.code === ErrorCodes.JOINT_ACCOUNT_PERSON_NEEDED ||
            // TODO: 'jointAccountContactNeeded' is obsolete, remove this key when BE stops supporting it
            error.code === 'jointAccountContactNeeded'));
}
//# sourceMappingURL=is-joint-account-person-needed-error.js.map