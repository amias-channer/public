import getProductDefaultFilterValue from '../product/get-product-default-filter-value';
import getProductFiltersFromLocationSearch from '../product/get-product-filters-from-location-search';
export default function getLeveragedProductDefaultFilterValues(client, searchStr) {
    const filters = getProductFiltersFromLocationSearch(searchStr);
    const { defaultLeveragedUnderlyingId, defaultLeveragedIssuerId, defaultLeveragedShortLong, defaultLeveragedExchangeId } = client.settings || {};
    return {
        ...filters,
        exchange: getProductDefaultFilterValue(filters.exchange, defaultLeveragedExchangeId),
        shortLong: getProductDefaultFilterValue(filters.shortLong, defaultLeveragedShortLong),
        issuer: getProductDefaultFilterValue(filters.issuer, defaultLeveragedIssuerId),
        underlying: getProductDefaultFilterValue(filters.underlying, defaultLeveragedUnderlyingId)
    };
}
//# sourceMappingURL=get-leveraged-product-default-filter-values.js.map