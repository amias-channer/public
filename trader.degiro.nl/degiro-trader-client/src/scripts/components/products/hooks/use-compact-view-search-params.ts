import {AppError} from 'frontend-core/dist/models/app-error';
import {ProductsRequestParams} from 'frontend-core/dist/services/products/product/get-products';
import {ProductInfo, ProductsSearchResult} from 'frontend-core/dist/models/product';
import {Config} from 'frontend-core/dist/models/config';
import {User} from 'frontend-core/dist/models/user';
import {useContext, useEffect} from 'react';
import useAsyncWithProgressiveState from 'frontend-core/dist/hooks/use-async-with-progressive-state';
import {ConfigContext, CurrentClientContext} from '../../app-component/app-context';
import useSorter from './use-sorter';
import InfiniteScrollContext from '../../infinite-scroll/infinite-scroll-context';

interface State<Value> {
    isLoading: boolean;
    error: Error | AppError | undefined;
    products: Value[] | undefined;
}

type PreparedRequestParams<T> = T &
    Required<
        Pick<
            ProductsRequestParams,
            'requireTotal' | 'loadExchangeInfo' | 'offset' | 'limit' | 'sortColumns' | 'sortTypes'
        >
    >;
const productAmountPerFrame = 25;

export default function useCompactViewSearchParams<ProductModel extends ProductInfo, RequestParams>(
    getProductsFn: (
        config: Config,
        currentClient: User,
        requestParams: PreparedRequestParams<RequestParams>
    ) => Promise<ProductsSearchResult<ProductModel[]>>,
    frameIndex: number,
    requestParams: RequestParams
): State<ProductModel> {
    const config = useContext(ConfigContext);
    const currentClient = useContext(CurrentClientContext);
    const {sortColumns, sortTypes} = useSorter();
    const {setFrameReady, stopAutoloadNextFrame} = useContext(InfiniteScrollContext);
    const {isLoading, value, error} = useAsyncWithProgressiveState<ProductsSearchResult<ProductModel[]>>(() => {
        return getProductsFn(config, currentClient, {
            ...requestParams,
            offset: frameIndex * productAmountPerFrame,
            limit: productAmountPerFrame,
            sortColumns,
            sortTypes,
            requireTotal: true,
            loadExchangeInfo: true
        });
    }, [frameIndex, requestParams]);

    useEffect(() => {
        if (!value || isLoading) {
            return;
        }

        const {data, total} = value;

        if (total !== undefined && total <= frameIndex * productAmountPerFrame + data.length) {
            stopAutoloadNextFrame();
        }

        setFrameReady(frameIndex);
    }, [isLoading, value, frameIndex]);

    return {
        isLoading,
        products: value?.data,
        error
    };
}
