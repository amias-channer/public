import getPathCredentials from '../api-requester/get-path-credentials';
import requestToApi from '../api-requester/request-to-api';
export default function getAccountInfo(config, options) {
    return requestToApi({
        config: {
            ...config,
            // do no send credentials
            sessionId: undefined,
            intAccount: undefined
        },
        url: `${config.tradingUrl}v5/account/info/${options.intAccount}${getPathCredentials(config)}`
    });
}
//# sourceMappingURL=get-account-info.js.map