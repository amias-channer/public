import requestToApi from '../api-requester/request-to-api';
export default function setAppVersionSettings(config, settings) {
    return requestToApi({
        method: 'PUT',
        url: `${config.paUrl}settings/beta-test`,
        config,
        body: {
            isEnabled: settings.isUserInEarlyAdoptersProgram,
            isEnabledForCurrentVersion: settings.isUserOnAppNextVersion
        }
    });
}
//# sourceMappingURL=set-app-version-settings.js.map