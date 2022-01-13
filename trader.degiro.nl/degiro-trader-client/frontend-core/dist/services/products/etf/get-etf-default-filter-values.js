import getProductDefaultFilterValue from '../product/get-product-default-filter-value';
import getProductFiltersFromLocationSearch from '../product/get-product-filters-from-location-search';
export default function getEtfDefaultFilterValues(client, searchString) {
    const filters = getProductFiltersFromLocationSearch(searchString);
    const { defaultEtfIssuerId, defaultEtfFeeType, defaultEtfExchangeId, defaultEtfPopularOnly } = client.settings || {};
    return {
        searchText: filters.searchText || undefined,
        feeType: getProductDefaultFilterValue(filters.feeType, defaultEtfFeeType),
        popularOnly: getProductDefaultFilterValue(filters.popularOnly, defaultEtfPopularOnly),
        exchange: getProductDefaultFilterValue(filters.exchange, defaultEtfExchangeId),
        issuer: getProductDefaultFilterValue(filters.issuer, defaultEtfIssuerId),
        region: getProductDefaultFilterValue(filters.region, undefined),
        benchmark: getProductDefaultFilterValue(filters.benchmark, undefined),
        assetAllocation: getProductDefaultFilterValue(filters.assetAllocation, undefined),
        totalExpenseRatioInterval: getProductDefaultFilterValue(filters.totalExpenseRatioInterval, {
            start: -Infinity,
            end: Infinity
        })
    };
}
//# sourceMappingURL=get-etf-default-filter-values.js.map