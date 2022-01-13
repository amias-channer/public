export default function getFundsSearchRequestParamsFromFilterValues({ searchText, issuer, feeType }) {
    return {
        investmentFundFeeTypeId: feeType ? Number(feeType) : undefined,
        investmentFundIssuerId: issuer ? Number(issuer) : undefined,
        searchText
    };
}
//# sourceMappingURL=get-funds-search-request-params-from-filter-values.js.map