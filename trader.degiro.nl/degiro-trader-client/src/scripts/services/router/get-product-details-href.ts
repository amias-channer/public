import {ProductSubLinks, Routes} from '../../navigation';

export default function getProductDetailsHref(
    productId: string | number,
    detailsTab: ProductSubLinks = ProductSubLinks.OVERVIEW
): string {
    return `${Routes.PRODUCTS}/${productId}/${detailsTab}`;
}
