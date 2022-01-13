import { ErrorCodes } from '../../models/app-error';
import isAppError from '../../services/app-error/is-app-error';
export default function isProductGovernanceSettingsChangeNeededError(error) {
    return isAppError(error) && error.code === ErrorCodes.PRODUCT_GOVERNANCE_SETTINGS_CHANGE_NEEDED;
}
//# sourceMappingURL=is-product-governance-setting-change-needed-error.js.map