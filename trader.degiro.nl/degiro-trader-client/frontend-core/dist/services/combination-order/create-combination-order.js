import { AppError } from '../../models/app-error';
import getPathCredentials from '../api-requester/get-path-credentials';
import requestToApi from '../api-requester/request-to-api';
export default function createCombinationOrder(config, orderData, orderConfirmation) {
    const { confirmationId } = orderConfirmation;
    return requestToApi({
        config,
        url: `${config.tradingUrl}v5/combinationOrder/${confirmationId}${getPathCredentials(config)}`,
        method: 'POST',
        body: orderData
    }).then((response) => {
        const { message = '', orderId = '' } = response || {};
        if (message && !orderId) {
            throw new AppError({
                text: message
            });
        }
    });
}
//# sourceMappingURL=create-combination-order.js.map