import createLazyComponent from 'frontend-core/dist/components/ui-common/lazy-component/create-lazy-component';
import {ProductInfo} from 'frontend-core/dist/models/product';
import {ProductType, ProductTypeIds} from 'frontend-core/dist/models/product-type';
import localize from 'frontend-core/dist/services/i18n/localize';
import getBondsSearchRequestParamsFromFilterValues from 'frontend-core/dist/services/products/bond/get-bonds-search-request-params-from-filter-values';
import getEtfsSearchRequestParamsFromFilterValues from 'frontend-core/dist/services/products/etf/get-etfs-search-request-params-from-filter-values';
import getFundsSearchRequestParamsFromFilterValues from 'frontend-core/dist/services/products/fund/get-funds-search-request-params-from-filter-values';
import getFuturesSearchRequestParamsFromFilterValues from 'frontend-core/dist/services/products/future/get-futures-search-request-params-from-filter-values';
import getLeveragedProductsSearchRequestParamsFromFilterValues from 'frontend-core/dist/services/products/leveraged/get-leveraged-products-search-request-params-from-filter-values';
import getStocksSearchRequestParamsFromFilterValues from 'frontend-core/dist/services/products/stock/get-stocks-search-request-params-from-filter-values';
import getWarrantsSearchRequestParamsFromFilterValues from 'frontend-core/dist/services/products/warrant/get-warrants-search-request-params-from-filter-values';
import * as React from 'react';
import {pageHeaderTitle} from '../page/page.css';
import {LeveragedsFiltersProps} from './leverageds/filters';
import {I18nContext} from '../app-component/app-context';
import Card from '../card';
import useNavigationThroughElementsByKeys from '../../hooks/use-navigation-through-elements-by-keys';
import useJumpFromOneSectionToAnotherByPressingKey from '../../hooks/use-jump-from-one-section-to-another-by-pressing-key';

// Search views
const StocksSearch = createLazyComponent(() => import(/* webpackChunkName: "stocks-search" */ './stocks/search'));
const FuturesSearch = createLazyComponent(() => import(/* webpackChunkName: "futures-search" */ './futures/search'));
const LeveragedsSearch = createLazyComponent(
    () => import(/* webpackChunkName: "leverageds-search" */ './leverageds/search')
);
const BondsSearch = createLazyComponent(() => import(/* webpackChunkName: "bonds-search" */ './bonds/search'));
const FundsSearch = createLazyComponent(() => import(/* webpackChunkName: "funds-search" */ './funds/search'));
const EtfsSearch = createLazyComponent(() => import(/* webpackChunkName: "etfs-search" */ './etfs/search'));
const WarrantsSearch = createLazyComponent(() => import(/* webpackChunkName: "warrants-search" */ './warrants/search'));
// Filter views
const StocksFilters = createLazyComponent(() => import(/* webpackChunkName: "stocks-filters" */ './stocks/filters'));
const FuturesFilters = createLazyComponent(() => import(/* webpackChunkName: "futures-filters" */ './futures/filters'));
const LeveragedsFilters = createLazyComponent(
    () => import(/* webpackChunkName: "leverageds-filters" */ './leverageds/filters')
);
const BondsFilters = createLazyComponent(() => import(/* webpackChunkName: "bonds-filters" */ './bonds/filters'));
const FundsFilters = createLazyComponent(() => import(/* webpackChunkName: "funds-filters" */ './funds/filters'));
const EtfsFilters = createLazyComponent(() => import(/* webpackChunkName: "etfs-filters" */ './etfs/filters'));
const WarrantsFilters = createLazyComponent(
    () => import(/* webpackChunkName: "warrants-filters" */ './warrants/filters')
);

export interface SearchByProductTypeProps {
    productType: ProductType;
    /**
     * `underlyingProduct` prop is used when we want to show some sub products table for some defined product
     * For example: product-options or product-leverageds
     *
     * Real world examples: (links can expire)
     * product-leverageds:
     *      https://internal.degiro.eu/trader/#/products/1819819/leveraged
     *
     * product-options:
     *      https://internal.degiro.eu/trader4_prod/#/products/1037624/options
     */
    underlyingProduct?: ProductInfo;
    hiddenFilters?: LeveragedsFiltersProps['hiddenFilters']; // this filed is used in Leverageds Filters
}

interface FiltersProps {
    onChange: (filters: any) => void;
    underlyingProduct?: ProductInfo;
    hiddenFilters?: LeveragedsFiltersProps['hiddenFilters'];
}

interface SearchComponentProps<SearchParams> {
    searchParams: SearchParams;
    onData?: (data: ProductInfo[]) => void;
}

type ProductTypeSearchItems<
    SearchParamsGetter extends (filterValues: any, underlyingProduct?: ProductInfo) => object = (
        filterValues: any,
        underlyingProduct?: ProductInfo
    ) => any
> = [
    React.ComponentType<SearchComponentProps<ReturnType<SearchParamsGetter>>>,
    React.ComponentType<FiltersProps>,
    SearchParamsGetter
];

enum SearchableProductTypeIds {
    STOCK = ProductTypeIds.STOCK,
    FUTURE = ProductTypeIds.FUTURE,
    LEVERAGED = ProductTypeIds.LEVERAGED,
    BOND = ProductTypeIds.BOND,
    FUND = ProductTypeIds.FUND,
    ETF = ProductTypeIds.ETF,
    WARRANT = ProductTypeIds.WARRANT
}
const {useState, useCallback, useContext, useRef, memo} = React;
const productTypesMap: Record<SearchableProductTypeIds, ProductTypeSearchItems> = {
    [SearchableProductTypeIds.STOCK]: [StocksSearch, StocksFilters, getStocksSearchRequestParamsFromFilterValues],
    [SearchableProductTypeIds.FUTURE]: [FuturesSearch, FuturesFilters, getFuturesSearchRequestParamsFromFilterValues],
    [SearchableProductTypeIds.LEVERAGED]: [
        LeveragedsSearch,
        LeveragedsFilters,
        getLeveragedProductsSearchRequestParamsFromFilterValues
    ],
    [SearchableProductTypeIds.BOND]: [BondsSearch, BondsFilters, getBondsSearchRequestParamsFromFilterValues],
    [SearchableProductTypeIds.FUND]: [FundsSearch, FundsFilters, getFundsSearchRequestParamsFromFilterValues],
    [SearchableProductTypeIds.ETF]: [EtfsSearch, EtfsFilters, getEtfsSearchRequestParamsFromFilterValues],
    [SearchableProductTypeIds.WARRANT]: [
        WarrantsSearch,
        WarrantsFilters,
        getWarrantsSearchRequestParamsFromFilterValues
    ]
};
const SearchByProductType = memo<SearchByProductTypeProps>(({hiddenFilters, productType, underlyingProduct}) => {
    const i18n = useContext(I18nContext);
    const [Search, Filters, getSearchPropsFromFiltersValues] = productTypesMap[productType.id];
    const [searchParams, setSearchParams] = useState<Record<string, any> | undefined>();
    const handleFiltersChange = useCallback(
        (newFilters) => {
            setSearchParams((searchParams) => {
                const newSearchParams = getSearchPropsFromFiltersValues(newFilters, underlyingProduct);

                return JSON.stringify(newSearchParams) === JSON.stringify(searchParams)
                    ? searchParams
                    : newSearchParams;
            });
        },
        [getSearchPropsFromFiltersValues, underlyingProduct]
    );
    // Keyboard navigation
    const filtersRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    useJumpFromOneSectionToAnotherByPressingKey(filtersRef, searchRef);
    useJumpFromOneSectionToAnotherByPressingKey(searchRef, filtersRef);
    useNavigationThroughElementsByKeys(searchRef);

    return (
        <Card
            data-name="productTypeSearch"
            data-product-type-id={productType.id}
            innerHorizontalGap={false}
            header={
                <div ref={filtersRef}>
                    <h1 className={pageHeaderTitle}>{localize(i18n, productType.translation)}</h1>
                    <Filters
                        hiddenFilters={hiddenFilters}
                        onChange={handleFiltersChange}
                        underlyingProduct={underlyingProduct}
                    />
                </div>
            }>
            {searchParams && (
                <div ref={searchRef}>
                    <Search searchParams={searchParams} />
                </div>
            )}
        </Card>
    );
});

SearchByProductType.displayName = 'SearchByProductType';
export default SearchByProductType;
