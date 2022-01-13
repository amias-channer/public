import requestToApi from '../api-requester/request-to-api';
export default function saveAppSettings(config, params) {
    return requestToApi({
        config: {
            ...config,
            intAccount: params.intAccount
        },
        url: `${config.paUrl}settings/user`,
        method: 'PUT',
        body: params.appSettings
    });
}
//# sourceMappingURL=save-app-settings.js.map