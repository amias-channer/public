import getPathCredentials from '../api-requester/get-path-credentials';
import requestToApi from '../api-requester/request-to-api';
export default function logout(config) {
    return requestToApi({
        config,
        url: `${config.tradingUrl}logout${getPathCredentials(config)}`,
        responseType: 'text'
    });
}
//# sourceMappingURL=logout.js.map