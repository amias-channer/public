import useAsyncWithProgressiveState from 'frontend-core/dist/hooks/use-async-with-progressive-state';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {AppError} from 'frontend-core/dist/models/app-error';
import {ProductInfo, ProductsSearchResult} from 'frontend-core/dist/models/product';
import getAppSettingsGroup from 'frontend-core/dist/services/app-settings/get-app-settings-group';
import setAppSettingsGroup from 'frontend-core/dist/services/app-settings/set-app-settings-group';
import {ProductsRequestParams} from 'frontend-core/dist/services/products/product/get-products';
import {useEffect, useState, useContext} from 'react';
import {Pagination} from '../../../models/pagination';
import createPagination from '../../../services/pagination/create-pagination';
import useSorter from './use-sorter';
import {ConfigContext, MainClientContext} from '../../app-component/app-context';

interface State<Value> {
    isLoading: boolean;
    error: Error | AppError | undefined;
    products: Value[] | undefined;
    pagination: Pagination;
}

interface Api {
    handleSortChange: (orderBy: string, field: string) => void;
    getOrderByValue: (field: string) => string;
    setPagination: (pagination: Pagination) => void;
}

type PreparedRequestParams<T> = T &
    Required<
        Pick<
            ProductsRequestParams,
            'requireTotal' | 'loadExchangeInfo' | 'offset' | 'limit' | 'sortColumns' | 'sortTypes'
        >
    >;

export default function useFullViewSearchParams<ProductModel extends ProductInfo, RequestParams>(
    getProductsFn: (
        requestParams: PreparedRequestParams<RequestParams>
    ) => Promise<ProductsSearchResult<ProductModel[]>>,
    requestParams: RequestParams
): State<ProductModel> & Api {
    const config = useContext(ConfigContext);
    const mainClient = useContext(MainClientContext);
    const {sortColumns, sortTypes, handleSortChange, getOrderByValue} = useSorter();
    const {productsSearchTableSize} = getAppSettingsGroup(mainClient);
    const [pagination, setPagination] = useState<Pagination>(() =>
        createPagination({pageNumber: 0, pageSize: productsSearchTableSize})
    );
    const {isLoading, error, value: productsResponse} = useAsyncWithProgressiveState<
        ProductsSearchResult<ProductModel[]>
    >(() => {
        return getProductsFn({
            ...requestParams,
            requireTotal: true,
            loadExchangeInfo: true,
            offset: pagination.pageNumber * pagination.pageSize,
            limit: pagination.pageSize,
            sortColumns,
            sortTypes
        });
    }, [pagination.pageNumber, pagination.pageSize, sortColumns, sortTypes, requestParams]);

    useEffect(() => {
        setPagination((pagination) => createPagination({...pagination, totalSize: productsResponse?.total || 0}));
    }, [productsResponse]);

    useEffect(() => {
        setPagination((pagination) => createPagination({...pagination, pageNumber: 0}));
    }, [requestParams, sortColumns, sortTypes]);

    useEffect(() => {
        if (pagination.pageSize !== productsSearchTableSize) {
            setAppSettingsGroup(config, mainClient, {productsSearchTableSize: pagination.pageSize}).catch(
                logErrorLocally
            );
        }
    }, [pagination.pageSize, productsSearchTableSize]);

    return {
        isLoading,
        error,
        products: productsResponse?.data,
        pagination,
        handleSortChange,
        getOrderByValue,
        setPagination
    };
}
