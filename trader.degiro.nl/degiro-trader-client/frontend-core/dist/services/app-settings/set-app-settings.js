import saveAppSettings from './save-app-settings';
export default function setAppSettings(config, mainClient, appSettings) {
    const newAppSettings = {
        ...mainClient.appSettings,
        ...appSettings
    };
    // "optimistic" scenario
    mainClient.appSettings = newAppSettings;
    return saveAppSettings(config, {
        intAccount: Number(mainClient.intAccount),
        appSettings: newAppSettings
    });
}
//# sourceMappingURL=set-app-settings.js.map