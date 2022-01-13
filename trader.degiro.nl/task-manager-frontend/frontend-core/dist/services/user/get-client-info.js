import requestToApi from '../api-requester/request-to-api';
import prepareClientData from './prepare-client-data';
export default function getClientInfo(config, options) {
    return requestToApi({
        url: `${config.paUrl}client`,
        config: options ? { ...config, intAccount: options.intAccount } : config
    }).then(prepareClientData);
}
//# sourceMappingURL=get-client-info.js.map