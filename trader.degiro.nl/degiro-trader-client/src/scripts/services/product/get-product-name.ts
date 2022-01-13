import {ProductInfo} from 'frontend-core/dist/models/product';
import {User} from 'frontend-core/dist/models/user';
import getProductExternalName from './get-product-external-name';

export default function getProductName(client: User, productInfo: ProductInfo): string {
    // https://sentry.io/organizations/degiro-bv/issues/1057718464/?project=116128
    return getProductExternalName(client, productInfo) || productInfo.name || '';
}
