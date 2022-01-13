import requestToApi from '../api-requester/request-to-api';
export default function isIexSubscriptionEnabled(config) {
    return requestToApi({
        config,
        url: `${config.paUrl}settings/iex`
    }).then((response) => {
        return Boolean(response && response.enabled);
    });
}
//# sourceMappingURL=is-iex-subscription-enabled.js.map