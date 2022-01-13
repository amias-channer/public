import {ProductInfo} from 'frontend-core/dist/models/product';
import {ProductTypeIds} from 'frontend-core/dist/models/product-type';
import getCurrencySymbol from 'frontend-core/dist/utils/currency/get-currency-symbol';

interface Params {
    onlyLeading?: boolean;
    onlyClosing?: boolean;
}

function getLimitFieldUnit(productInfo: ProductInfo, params: {onlyLeading: boolean}): undefined | string;
function getLimitFieldUnit(productInfo: ProductInfo, params: {onlyClosing: boolean}): undefined | string;
function getLimitFieldUnit(productInfo: ProductInfo): string;
function getLimitFieldUnit(productInfo: ProductInfo, params: Params = {}) {
    if (productInfo.productTypeId === ProductTypeIds.BOND) {
        return params.onlyLeading ? undefined : '%';
    }

    return params.onlyClosing ? undefined : getCurrencySymbol(productInfo.currency);
}

export default getLimitFieldUnit;
