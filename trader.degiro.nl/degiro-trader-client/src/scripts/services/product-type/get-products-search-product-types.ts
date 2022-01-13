import {Config} from 'frontend-core/dist/models/config';
import {ProductType, ProductTypeIds} from 'frontend-core/dist/models/product-type';
import {User} from 'frontend-core/dist/models/user';
import canViewProductType from 'frontend-core/dist/services/product-type/can-view-product-type';
import getProductTypes from 'frontend-core/dist/services/product-type/get-product-types';

const productsSearchTypeIds: ProductTypeIds[] = [
    ProductTypeIds.STOCK,
    ProductTypeIds.ETF,
    ProductTypeIds.BOND,
    ProductTypeIds.FUND,
    ProductTypeIds.LEVERAGED,
    ProductTypeIds.WARRANT,
    ProductTypeIds.OPTION,
    ProductTypeIds.FUTURE
];

export default async function getProductsSearchProductTypes(
    config: Config,
    currentClient: User
): Promise<ProductType[]> {
    const allProductTypes: ProductType[] = await getProductTypes(config);

    return allProductTypes
        .filter((productType: ProductType) => {
            const {id} = productType;

            // [WF-1946] Hide Leveraged Products and Warrants for Spanish clients
            if (currentClient.culture === 'ES' && (id === ProductTypeIds.LEVERAGED || id === ProductTypeIds.WARRANT)) {
                return false;
            }

            // Hide forbidden product types completely for CUSTODY clients, for the others we will show a special
            // message on UI to upgrade their account type
            if (currentClient.isCustodyPensionClient || currentClient.isCustodyClient) {
                return canViewProductType(productType, currentClient) && productsSearchTypeIds.includes(id);
            }

            return productsSearchTypeIds.includes(id);
        })
        .sort(
            (first: ProductType, second: ProductType) =>
                productsSearchTypeIds.indexOf(first.id) - productsSearchTypeIds.indexOf(second.id)
        );
}
