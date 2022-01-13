import {Config} from 'frontend-core/dist/models/config';
import {ProductType, ProductTypeIds} from 'frontend-core/dist/models/product-type';
import getProductTypes from 'frontend-core/dist/services/product-type/get-product-types';

export default async function getPositionGroupTypes(config: Config): Promise<ProductType[]> {
    const allProductTypes: ProductType[] = await getProductTypes(config);
    const bondProductType: ProductType | undefined = allProductTypes.find((productType: ProductType) => {
        return productType.id === ProductTypeIds.BOND;
    });
    const cashProductType: ProductType | undefined = allProductTypes.find((productType: ProductType) => {
        return productType.id === ProductTypeIds.CASH;
    });
    const productTypes = allProductTypes.filter((productType: ProductType) => {
        return productType !== bondProductType && productType !== cashProductType;
    });

    // Move bonds and cash funds to the end of the list
    if (bondProductType) {
        productTypes.push(bondProductType);
    }

    if (cashProductType) {
        productTypes.push(cashProductType);
    }

    return productTypes;
}
