import mapObjectByValues from '../../../utils/map-object-by-values';
import getDictionary from '../../dictionary/get-dictionary';
import getFilterOptionAll from '../../filter/get-filter-option-all';
import isEmptyFilterValue from '../is-empty-filter-value';
import getLeveragedProductAggregateValues from './get-leveraged-product-aggregate-values';
function getAggregateParams(aggregateTypes, filters) {
    const outputAggregateTypes = aggregateTypes.filter((filterKey) => isEmptyFilterValue(filters[filterKey]));
    const inputAggregateTypes = aggregateTypes.filter((filterKey) => !isEmptyFilterValue(filters[filterKey]));
    const inputAggregateValues = inputAggregateTypes.map((filterKey) => String(filters[filterKey]));
    const hasInputAggregates = Boolean(inputAggregateTypes[0]);
    return {
        inputAggregateTypes: hasInputAggregates ? inputAggregateTypes : undefined,
        inputAggregateValues: hasInputAggregates ? inputAggregateValues : undefined,
        outputAggregateTypes
    };
}
export default async function getLeveragedProductsFiltersOptions(config, i18n, filters, prevFilters = {}, prevFiltersOptions) {
    const { searchText, ...restFilters } = filters;
    const isExchangeChanged = String(prevFilters.exchange) !== String(restFilters.exchange);
    const isIssuerChanged = String(prevFilters.issuer) !== String(restFilters.issuer);
    const isUnderlyingChanged = String(prevFilters.underlying) !== String(restFilters.underlying);
    const { leveragedAggregateTypes } = await getDictionary(config);
    const aggregateTypes = leveragedAggregateTypes
        .filter(({ id }) => id !== 'underlyingProductId' && id !== 'expirationDateRange')
        .map(({ id }) => id);
    const aggregateParams = getAggregateParams(aggregateTypes, restFilters);
    const outputAggregateTypesForValuesWithoutOptions = aggregateTypes.filter((filterKey) => {
        // [WEB-4337]: issuer, exchange & underlying lists are linked to each other
        if ((filterKey === 'exchange' && (isIssuerChanged || isUnderlyingChanged)) ||
            (filterKey === 'issuer' && (isExchangeChanged || isUnderlyingChanged)) ||
            (filterKey === 'underlying' && (isExchangeChanged || isIssuerChanged))) {
            return true;
        }
        return !isEmptyFilterValue(restFilters[filterKey]) && !prevFiltersOptions[filterKey];
    });
    const [filterOptions, filterOptionsForSettledValues] = await Promise.all([
        await getLeveragedProductAggregateValues(config, { ...aggregateParams }),
        outputAggregateTypesForValuesWithoutOptions.length !== 0
            ? getLeveragedProductAggregateValues(config, {
                outputAggregateTypes: outputAggregateTypesForValuesWithoutOptions
            })
            : {}
    ]);
    return {
        ...prevFiltersOptions,
        ...mapObjectByValues({ ...filterOptions, ...filterOptionsForSettledValues }, (options) => {
            return options === undefined ? undefined : [getFilterOptionAll(i18n), ...options];
        })
    };
}
//# sourceMappingURL=get-leveraged-products-filters-options.js.map