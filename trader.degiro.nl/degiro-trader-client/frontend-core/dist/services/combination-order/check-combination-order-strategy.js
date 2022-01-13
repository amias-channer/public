import getPathCredentials from '../api-requester/get-path-credentials';
import requestToApi from '../api-requester/request-to-api';
export default function checkCombinationOrderStrategy(config, strategy) {
    return requestToApi({
        config,
        url: `${config.tradingUrl}v5/checkCombinationOrderStrategy${getPathCredentials(config)}`,
        method: 'POST',
        body: strategy
    });
}
//# sourceMappingURL=check-combination-order-strategy.js.map