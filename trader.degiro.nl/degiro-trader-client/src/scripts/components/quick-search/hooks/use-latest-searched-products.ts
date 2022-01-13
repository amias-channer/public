import useAsync from 'frontend-core/dist/hooks/use-async';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {AppError} from 'frontend-core/dist/models/app-error';
import {Config} from 'frontend-core/dist/models/config';
import {ProductInfo} from 'frontend-core/dist/models/product';
import {User} from 'frontend-core/dist/models/user';
import {useCallback, useContext, useState} from 'react';
import addLatestSearchedProducts from '../../../services/latest-searched-product/add-latest-searched-products';
import deleteAllLatestSearchedProducts from '../../../services/latest-searched-product/delete-all-latest-searched-products';
import deleteLatestSearchedProduct from '../../../services/latest-searched-product/delete-latest-searched-product';
import getLatestSearchedProducts from '../../../services/latest-searched-product/get-latest-searched-products';
import {ConfigContext, CurrentClientContext} from '../../app-component/app-context';

interface State {
    isLoading: boolean;
    products: ProductInfo[];
    error?: Error | AppError;
}

interface Api {
    addProduct(productInfo: ProductInfo): void;
    deleteProduct(productInfo: ProductInfo): void;
    deleteAllProducts(): void;
}

type Result = Api & State;

export default function useLatestSearchedProducts(): Result {
    const config: Config = useContext(ConfigContext);
    const currentClient: User = useContext(CurrentClientContext);
    const [products, setProducts] = useState<ProductInfo[]>([]);
    const {isLoading, error} = useAsync(() => getLatestSearchedProducts(config, currentClient).then(setProducts), [
        config,
        currentClient
    ]);
    const addProduct = useCallback(
        (productInfo: ProductInfo) => {
            const productId = productInfo.id;

            // avoid adding duplicates
            setProducts((products) => [productInfo, ...products.filter((productInfo) => productInfo.id !== productId)]);
            addLatestSearchedProducts(config, [productId]).catch(logErrorLocally);
        },
        [config]
    );
    const deleteProduct = useCallback(
        (productInfo: ProductInfo) => {
            const productId = productInfo.id;

            setProducts((products) => products.filter((productInfo) => productInfo.id !== productId));
            deleteLatestSearchedProduct(config, productId).catch(logErrorLocally);
        },
        [config]
    );
    const deleteAllProducts = useCallback(() => {
        setProducts([]);
        deleteAllLatestSearchedProducts(config).catch(logErrorLocally);
    }, [config]);

    return {isLoading, products, error, addProduct, deleteProduct, deleteAllProducts};
}
