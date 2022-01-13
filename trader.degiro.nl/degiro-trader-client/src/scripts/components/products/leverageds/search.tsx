import createLazyComponent from 'frontend-core/dist/components/ui-common/lazy-component/create-lazy-component';
import {LeveragedProductsSearchRequestParams} from 'frontend-core/dist/services/products/leveraged/get-leveraged-products-search-request-params-from-filter-values';
import {ProductInfo} from 'frontend-core/dist/models/product';
import useMediaQuery from 'frontend-core/dist/hooks/use-media-query';
import useAsync from 'frontend-core/dist/hooks/use-async';
import * as React from 'react';
import {ConfigContext} from '../../app-component/app-context';
import CompactSearchView from './search-compact-view';
import FullSearchView from './search-full-view';
import getLeveragedProductsRiskWarning from '../../../services/products/leveraged/get-leveraged-products-risk-warning';
import hasProductWithOnlyEodPrices from '../has-product-with-only-eod-prices';
import {scrollableTable as fullLayoutMediaQuery} from '../../../media-queries';
import {SearchHighlightContext} from '../../search-highlight';
import {warningPanel} from '../products.css';

const EodPricesWarningPanel = createLazyComponent(
    () => import(/* webpackChunkName: "eod-prices-warning-panel" */ '../../eod-prices-warning/panel')
);
const RiskWarningPanel = createLazyComponent(
    () => import(/* webpackChunkName: "risk-warning-panel" */ './risk-warning-panel')
);

export interface LeveragedsSearchProps {
    searchParams: LeveragedProductsSearchRequestParams;
    onData?: (data: ProductInfo[]) => void;
}

const {useState, useContext} = React;
const LeveragedsSearch: React.FunctionComponent<LeveragedsSearchProps> = ({searchParams}) => {
    const config = useContext(ConfigContext);
    const hasFullView = useMediaQuery(fullLayoutMediaQuery);
    const [searchData, setSearchData] = useState<ProductInfo[]>();
    const {searchText = ''} = searchParams;
    const {value: riskWarning} = useAsync(() => getLeveragedProductsRiskWarning(config), [config]);

    return (
        <>
            {searchData && hasProductWithOnlyEodPrices(searchData) && (
                <EodPricesWarningPanel className={warningPanel} data-test="eodPricesWarningPanel" />
            )}
            {riskWarning?.showWarning && <RiskWarningPanel className={warningPanel} data-test="riskWarningPanel" />}
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

export default React.memo(LeveragedsSearch);
