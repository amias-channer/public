import {Config} from 'frontend-core/dist/models/config';
import {ProductInfo, ProductsInfo} from 'frontend-core/dist/models/product';
import {User} from 'frontend-core/dist/models/user';
import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import getProductsInfo from 'frontend-core/dist/services/products/product/get-products-info';
import omitNullable from 'frontend-core/dist/utils/omit-nullable';

type ProductId = ProductInfo['id'];

export default async function getLatestSearchedProducts(config: Config, currentClient: User): Promise<ProductInfo[]> {
    const {productIds}: {productIds?: ProductId[]} = await requestToApi({
        config,
        url: `${config.latestSearchedProductsUrl}last-searched-products/product-ids`
    });

    if (!productIds?.length) {
        return [];
    }

    const productsInfo: ProductsInfo = await getProductsInfo(config, currentClient, {productIds});

    // keep the ordering according to the product IDs list
    return omitNullable(productIds.map((productId: ProductId): ProductInfo | undefined => productsInfo[productId]));
}
