import requestToApi from '../api-requester/request-to-api';
export default function getClientSettings(config, options) {
    return requestToApi({
        config: {
            ...config,
            intAccount: options.intAccount
        },
        url: `${config.paUrl}settings/web`
    });
}
//# sourceMappingURL=get-client-settings.js.map