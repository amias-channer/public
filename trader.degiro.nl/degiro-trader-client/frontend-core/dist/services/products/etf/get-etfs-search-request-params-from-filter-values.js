import isFilterOptionAll from '../../filter/is-filter-option-all';
export default function getEtfsSearchRequestParamsFromFilterValues({ feeType, popularOnly, searchText, issuer, totalExpenseRatioInterval, ...paramsForInputAggregateProp }) {
    const [inputAggregateTypes, inputAggregateValues] = Object.entries(paramsForInputAggregateProp).reduce(([aggregateTypes, aggregateValues], [key, value]) => {
        if (value && !isFilterOptionAll(value)) {
            aggregateTypes.push(key);
            aggregateValues.push(value);
        }
        return [aggregateTypes, aggregateValues];
    }, [[], []]);
    return {
        searchText,
        popularOnly: Boolean(popularOnly),
        etfFeeTypeId: feeType ? Number(feeType) : undefined,
        etfIssuerId: issuer,
        minTotalExpenseRatio: (totalExpenseRatioInterval === null || totalExpenseRatioInterval === void 0 ? void 0 : totalExpenseRatioInterval.start) !== -Infinity ? totalExpenseRatioInterval.start : undefined,
        maxTotalExpenseRatio: (totalExpenseRatioInterval === null || totalExpenseRatioInterval === void 0 ? void 0 : totalExpenseRatioInterval.end) !== Infinity ? totalExpenseRatioInterval.end : undefined,
        inputAggregateTypes,
        inputAggregateValues
    };
}
//# sourceMappingURL=get-etfs-search-request-params-from-filter-values.js.map