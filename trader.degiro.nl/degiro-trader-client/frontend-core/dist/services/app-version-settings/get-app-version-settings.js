import requestToApi from '../api-requester/request-to-api';
export default function getAppVersionSettings(config, options) {
    return requestToApi({
        config: { ...config, intAccount: options.intAccount },
        url: `${config.paUrl}settings/beta-test` // TODO: change endpoint to "app-version-settings"
    }).then((response) => ({
        isUserInEarlyAdoptersProgram: Boolean(response.isEnabled),
        isUserOnAppNextVersion: Boolean(response.isEnabledForCurrentVersion),
        isUserForcedToAppNextVersion: Boolean(response.isForced)
    }));
}
//# sourceMappingURL=get-app-version-settings.js.map