import createLazyComponent from 'frontend-core/dist/components/ui-common/lazy-component/create-lazy-component';
import useMediaQuery from 'frontend-core/dist/hooks/use-media-query';
import {ProductInfo} from 'frontend-core/dist/models/product';
import {EtfsSearchRequestParams} from 'frontend-core/dist/services/products/etf/get-etfs-search-request-params-from-filter-values';
import * as React from 'react';
import {scrollableTable as fullLayoutMediaQuery} from '../../../media-queries';
import hasProductWithOnlyEodPrices from '../has-product-with-only-eod-prices';
import {warningPanel} from '../products.css';
import CompactSearchView from './search-compact-view';
import FullSearchView from './search-full-view';
import {SearchHighlightContext} from '../../search-highlight';

const EodPricesWarningPanel = createLazyComponent(
    () => import(/* webpackChunkName: "eod-prices-warning-panel" */ '../../eod-prices-warning/panel')
);

export interface ETFsSearchProps {
    searchParams: EtfsSearchRequestParams;
    onData?: (data: ProductInfo[]) => void;
}

const {useState} = React;
const EtfsSearch: React.FunctionComponent<ETFsSearchProps> = ({searchParams}) => {
    const hasFullView = useMediaQuery(fullLayoutMediaQuery);
    const [searchData, setSearchData] = useState<ProductInfo[]>();
    const {searchText = ''} = searchParams;

    return (
        <>
            {searchData && hasProductWithOnlyEodPrices(searchData) && (
                <EodPricesWarningPanel className={warningPanel} />
            )}
            <SearchHighlightContext.Provider value={searchText}>
                {hasFullView ? (
                    <FullSearchView searchParams={searchParams} onData={setSearchData} />
                ) : (
                    <CompactSearchView searchParams={searchParams} onData={setSearchData} />
                )}
            </SearchHighlightContext.Provider>
        </>
    );
};

export default React.memo(EtfsSearch);
