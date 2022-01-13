import {ProductInfo} from 'frontend-core/dist/models/product';
import {ProductTypeIds} from 'frontend-core/dist/models/product-type';

export default function isTradableProduct(productInfo: ProductInfo): boolean {
    return Boolean(productInfo.tradable && productInfo.productTypeId !== ProductTypeIds.CASH);
}
