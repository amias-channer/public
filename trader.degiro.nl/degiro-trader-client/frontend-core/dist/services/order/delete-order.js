import getPathCredentials from '../api-requester/get-path-credentials';
import requestToApi from '../api-requester/request-to-api';
export default function deleteOrder(config, order) {
    return requestToApi({
        config,
        url: `${config.tradingUrl}v5/order/${order.id}${getPathCredentials(config)}`,
        method: 'DELETE'
    });
}
//# sourceMappingURL=delete-order.js.map