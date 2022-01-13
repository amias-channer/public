import {Config} from 'frontend-core/dist/models/config';
import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';

export default function deleteAllLatestSearchedProducts(config: Config): Promise<void> {
    return requestToApi({
        config,
        url: `${config.latestSearchedProductsUrl}last-searched-products/product-ids`,
        method: 'DELETE'
    });
}
