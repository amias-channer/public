import {ProductInfo} from 'frontend-core/dist/models/product';

export default function compareProductsByProductType(first: ProductInfo, second: ProductInfo): number {
    if (first.productTypeId < second.productTypeId) {
        return -1;
    }

    if (first.productTypeId > second.productTypeId) {
        return 1;
    }

    return 0;
}
