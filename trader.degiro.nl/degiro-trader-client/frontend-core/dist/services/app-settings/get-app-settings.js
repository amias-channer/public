import requestToApi from '../api-requester/request-to-api';
export default function getAppSettings(config, options) {
    return requestToApi({
        config: {
            ...config,
            intAccount: options.intAccount
        },
        url: `${config.paUrl}settings/user`
    }).then((response) => {
        // normalize response
        return { ...response };
    });
}
//# sourceMappingURL=get-app-settings.js.map