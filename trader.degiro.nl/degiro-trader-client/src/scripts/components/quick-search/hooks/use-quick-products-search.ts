import useAsyncWithProgressiveState from 'frontend-core/dist/hooks/use-async-with-progressive-state';
import {AppError} from 'frontend-core/dist/models/app-error';
import {Config} from 'frontend-core/dist/models/config';
import {ProductInfo, ProductsSearchResult} from 'frontend-core/dist/models/product';
import {ProductTypeIds} from 'frontend-core/dist/models/product-type';
import {User} from 'frontend-core/dist/models/user';
import getProducts from 'frontend-core/dist/services/products/product/get-products';
import {useContext} from 'react';
import compareProductsByProductType from '../../../services/product/compare-products-by-product-type';
import {ConfigContext, CurrentClientContext} from '../../app-component/app-context';

interface State {
    isLoading: boolean;
    products?: ProductInfo[];
    error?: Error | AppError;
}

export default function useQuickProductsSearch(searchText: string, productTypeId: ProductTypeIds | undefined): State {
    const config: Config = useContext(ConfigContext);
    const currentClient: User = useContext(CurrentClientContext);
    const {isLoading, error, value: products} = useAsyncWithProgressiveState<ProductInfo[]>(async () => {
        if (!searchText.trim()) {
            return [];
        }

        const searchResult: ProductsSearchResult = await getProducts(config, currentClient, {
            offset: 0,
            limit: 10,
            searchText,
            productTypeId
        });

        return [...searchResult.data].sort(compareProductsByProductType);
    }, [searchText, productTypeId]);

    return {isLoading, error, products};
}
