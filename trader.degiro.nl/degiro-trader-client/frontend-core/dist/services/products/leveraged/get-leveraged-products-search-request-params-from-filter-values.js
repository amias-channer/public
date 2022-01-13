import isFilterOptionAll from '../../filter/is-filter-option-all';
export default function getLeveragedProductsSearchRequestParamsFromFilterValues(filters, underlyingProduct) {
    const { issuer, exchange, shortLong, underlying, searchText } = filters;
    const inputAggregateTypes = [];
    const inputAggregateValues = [];
    if (issuer && !isFilterOptionAll(issuer)) {
        inputAggregateTypes.push('issuer');
        inputAggregateValues.push(issuer);
    }
    if (exchange && !isFilterOptionAll(exchange)) {
        inputAggregateTypes.push('exchange');
        inputAggregateValues.push(exchange);
    }
    if (underlying && !isFilterOptionAll(underlying)) {
        inputAggregateTypes.push('underlying');
        inputAggregateValues.push(underlying);
    }
    if (shortLong != null && !isFilterOptionAll(shortLong)) {
        inputAggregateTypes.push('shortLong');
        inputAggregateValues.push(shortLong);
    }
    if (underlyingProduct) {
        inputAggregateTypes.push('underlyingProductId');
        inputAggregateValues.push(String(underlyingProduct.id));
    }
    return {
        inputAggregateTypes,
        inputAggregateValues,
        searchText
    };
}
//# sourceMappingURL=get-leveraged-products-search-request-params-from-filter-values.js.map