import {ProductInfo} from 'frontend-core/dist/models/product';
import {QuotecastFieldData} from 'frontend-core/dist/models/quotecast';
import {User} from 'frontend-core/dist/models/user';
import canShowExternalProductName from 'frontend-core/dist/services/product-type/can-show-external-product-name';

export default function getProductExternalName(client: User, productInfo: ProductInfo): string | undefined {
    const nameData: QuotecastFieldData<string> | undefined = productInfo.FullName;

    return (nameData && canShowExternalProductName(productInfo, client) && nameData.value) || undefined;
}
