import getPathCredentials from '../api-requester/get-path-credentials';
import requestToApi from '../api-requester/request-to-api';
import getCurrencyOrderRequestData from './get-currency-order-request-data';
export default function createCurrencyOrder(config, params, orderConfirmation) {
    return requestToApi({
        config,
        url: `${config.tradingUrl}v5/order/${orderConfirmation.confirmationId}${getPathCredentials(config)}`,
        method: 'POST',
        body: getCurrencyOrderRequestData(params)
    });
}
//# sourceMappingURL=create-currency-order.js.map