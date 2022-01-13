export default function getBondsSearchRequestParamsFromFilterValues({ issuerType, searchText, exchange }) {
    return {
        bondIssuerTypeId: issuerType ? Number(issuerType) : undefined,
        bondExchangeId: exchange ? Number(exchange) : undefined,
        searchText
    };
}
//# sourceMappingURL=get-bonds-search-request-params-from-filter-values.js.map