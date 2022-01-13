import getAppSettingsGroupName from './get-app-settings-group-name';
import setAppSettings from './set-app-settings';
export default function setAppSettingsGroup(config, mainClient, appSettingsGroup, options) {
    const { onlyForGroup } = options || {};
    const settingsGroupName = getAppSettingsGroupName();
    if (onlyForGroup && onlyForGroup !== settingsGroupName) {
        return Promise.resolve();
    }
    const { appSettings = {} } = mainClient;
    const newAppSettings = {
        ...appSettings,
        [settingsGroupName]: {
            ...appSettings[settingsGroupName],
            ...appSettingsGroup
        }
    };
    return setAppSettings(config, mainClient, newAppSettings);
}
//# sourceMappingURL=set-app-settings-group.js.map