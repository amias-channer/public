import getPathCredentials from '../api-requester/get-path-credentials';
import requestToApi from '../api-requester/request-to-api';
export default function checkCombinationOrder(config, orderData) {
    return requestToApi({
        config,
        url: `${config.tradingUrl}v5/checkCombinationOrder${getPathCredentials(config)}`,
        method: 'POST',
        body: orderData
    });
}
//# sourceMappingURL=check-combination-order.js.map