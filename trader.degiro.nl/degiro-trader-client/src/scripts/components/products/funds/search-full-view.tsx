import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {ProductInfo} from 'frontend-core/dist/models/product';
import getFunds, {FundsRequestParams} from 'frontend-core/dist/services/products/fund/get-funds';
import * as React from 'react';
import isNonEmptyArray from 'frontend-core/dist/utils/collection/is-non-empty-array';
import {loading} from 'frontend-core/dist/components/ui-trader4/visibility-utils.css';
import ProductsTable, {Column} from '../../data-table/products-table';
import useFullViewSearchParams from '../hooks/use-full-view-search-params';
import {FundsSearchProps} from './search';
import {AppApiContext, ConfigContext, CurrentClientContext} from '../../app-component/app-context';
import TableFooter from '../../data-table/table-footer';
import Card from '../../card';

const {useEffect, useContext} = React;
const tableViewColumns: Column[] = [
    'name',
    'symbolIsin',
    'LastPrice.value',
    'AbsoluteDifference.value',
    'RelativeDifference.value',
    'BidPrice.value',
    'AskPrice.value',
    'CumulativeVolume.value',
    'OpenPrice.value',
    'CurrentClosePrice.value',
    'CombinedLastDateTime.value',
    'feedQuality'
];
const FundsFullSearchView: React.FunctionComponent<FundsSearchProps> = ({searchParams, onData}) => {
    const config = useContext(ConfigContext);
    const currentClient = useContext(CurrentClientContext);
    const app = useContext(AppApiContext);
    const {
        products,
        isLoading,
        error,
        pagination,
        handleSortChange,
        getOrderByValue,
        setPagination
    } = useFullViewSearchParams<ProductInfo, FundsRequestParams>(
        (searchParams) => getFunds(config, currentClient, searchParams),
        searchParams
    );

    useEffect(() => products && onData?.(products), [products, onData]);

    if (error) {
        logErrorLocally(error);
        app.openModal({error});
    }

    return (
        <Card
            innerHorizontalGap={false}
            footer={
                products &&
                isNonEmptyArray(products) && <TableFooter pagination={pagination} onPaginationChange={setPagination} />
            }>
            <div className={isLoading ? loading : undefined}>
                <ProductsTable
                    columns={tableViewColumns}
                    getOrderByValue={getOrderByValue}
                    products={products}
                    onSortChange={handleSortChange}
                />
            </div>
        </Card>
    );
};

export default React.memo(FundsFullSearchView);
