import {ProductInfo} from 'frontend-core/dist/models/product';
import {OptionProduct} from 'frontend-core/dist/models/option';

export default function hasProductWithOnlyEodPrices(products: ProductInfo[] | OptionProduct[]): boolean {
    return products.some((product: ProductInfo | OptionProduct) => {
        const {call, put} = product as OptionProduct;
        const productInfo: ProductInfo | undefined = product as ProductInfo;

        return call?.onlyEodPrices || put?.onlyEodPrices || productInfo?.onlyEodPrices;
    });
}
