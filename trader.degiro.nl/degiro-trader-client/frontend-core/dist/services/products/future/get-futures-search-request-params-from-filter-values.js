export default function getFuturesSearchRequestParamsFromFilterValues(filters) {
    const { country, underlying, exchange, searchText } = filters;
    return {
        futureExchangeId: exchange ? Number(exchange) : undefined,
        underlyingIsin: underlying,
        eurexCountryId: country ? Number(country) : undefined,
        searchText
    };
}
//# sourceMappingURL=get-futures-search-request-params-from-filter-values.js.map