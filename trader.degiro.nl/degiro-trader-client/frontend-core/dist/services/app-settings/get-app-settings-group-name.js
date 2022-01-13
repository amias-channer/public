import { AppSettingsGroupNames } from '../../models/app-settings';
import isTouchDevice from '../../platform/is-touch-device';
export default function getAppSettingsGroupName() {
    return isTouchDevice() ? AppSettingsGroupNames.MOBILE : AppSettingsGroupNames.DESKTOP;
}
//# sourceMappingURL=get-app-settings-group-name.js.map