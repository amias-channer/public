import getAppSettingsGroupName from './get-app-settings-group-name';
export default function getAppSettingsGroup(client) {
    const { appSettings } = client;
    return (appSettings && appSettings[getAppSettingsGroupName()]) || {};
}
//# sourceMappingURL=get-app-settings-group.js.map