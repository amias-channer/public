import getProductDefaultFilterValue from '../product/get-product-default-filter-value';
import getProductFiltersFromLocationSearch from '../product/get-product-filters-from-location-search';
export default function getFundDefaultFilterValues({ settings }, searchStr) {
    const filters = getProductFiltersFromLocationSearch(searchStr);
    const { defaultFundFeeType, defaultFundIssuerId } = settings || {};
    return {
        ...filters,
        feeType: getProductDefaultFilterValue(filters.feeType, defaultFundFeeType),
        issuer: getProductDefaultFilterValue(filters.issuer, defaultFundIssuerId)
    };
}
//# sourceMappingURL=get-fund-default-filter-values.js.map