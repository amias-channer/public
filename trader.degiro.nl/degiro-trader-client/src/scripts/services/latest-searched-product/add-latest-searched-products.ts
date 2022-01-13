import {Config} from 'frontend-core/dist/models/config';
import {ProductInfo} from 'frontend-core/dist/models/product';
import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';

export default function addLatestSearchedProducts(config: Config, productIds: ProductInfo['id'][]): Promise<void> {
    return requestToApi({
        config,
        url: `${config.latestSearchedProductsUrl}last-searched-products/product-ids`,
        method: 'POST',
        body: {productIds}
    });
}
