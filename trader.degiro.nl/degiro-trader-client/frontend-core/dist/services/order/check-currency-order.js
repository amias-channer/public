import getPathCredentials from '../api-requester/get-path-credentials';
import requestToApi from '../api-requester/request-to-api';
import getCurrencyOrderRequestData from './get-currency-order-request-data';
export default function checkCurrencyOrder(config, params) {
    return requestToApi({
        config,
        url: `${config.tradingUrl}v5/checkOrder${getPathCredentials(config)}`,
        method: 'POST',
        body: getCurrencyOrderRequestData(params)
    });
}
//# sourceMappingURL=check-currency-order.js.map