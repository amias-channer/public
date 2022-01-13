import isInterval from '../../../utils/interval/is-interval';
import mapObjectByValues from '../../../utils/map-object-by-values';
import pipe from '../../../utils/pipe';
import requestToApi from '../../api-requester/request-to-api';
import getDictionary from '../../dictionary/get-dictionary';
import getFilterOptionAll from '../../filter/get-filter-option-all';
import isFilterOptionAll from '../../filter/is-filter-option-all';
import isEmptyFilterValue from '../is-empty-filter-value';
import { productsSearchCache } from '../products-search-cache';
import setNoneValueTranslationByFilterKey from '../set-none-value-translation-by-filter-key';
const addTranslationToAggregateValues = pipe(setNoneValueTranslationByFilterKey('assetAllocation', 'trader.filtersList.regionFilter.notInAnyAssetAllocation'), setNoneValueTranslationByFilterKey('region', 'trader.filtersList.regionFilter.notInAnyRegion'), setNoneValueTranslationByFilterKey('benchmark', 'trader.filtersList.benchmarkFilter.notInAnyBenchmark'));
async function getEtfAggregateValues(config, aggregatesParams) {
    return addTranslationToAggregateValues(await requestToApi({
        config,
        url: `${config.productSearchUrl}v5/etfs/aggregates`,
        params: aggregatesParams,
        cache: productsSearchCache
    }));
}
function getEtfAggregateParams(aggregateTypes, filters) {
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
// TODO: remove this function when BE will fix this issue: http://dejira/browse/TRADER-1214
function fixBugWhenGetEtfAggregateValuesReturnsEmptyObject(response, expectedFields) {
    return expectedFields.reduce((acc, key) => {
        if (!acc[key]) {
            acc[key] = [];
        }
        return acc;
    }, { ...response });
}
// TODO: Please rewrite this implementation after http://dejira/browse/TRADER-1157 will be solved
/**
 * @important This function works with some workarounds.
 *
 * For some details please follow http://dejira/browse/TRADER-1157
 *
 * He have a bug on BE when if you provide some prop in inputAggregateTypes and set this prop as outputAggregateTypes
 * server send response as a singe value
 *
 * Request Example:
 *      GET https://{{productSearchUrl}}/v5/etfs/aggregates
 *              ?popularOnly=false
 *              &inputAggregateTypes=class
 *              &inputAggregateValues=1
 *              &outputAggregateTypes=class
 *              &intAccount={{intAccount}}
 *              &sessionId={{sessionId}}
 * Response:
 *       {
 *         "data": {
 *           "class": [{"id": "(AUD) A", "name": "(AUD) A"}]
 *         }
 *       }
 *
 * In this case we do not have enough data to initialize our filters form
 * that is why we send two request:
 * Example:
 *      filter values: class = 1, region = Europe
 *      first request:
 *          inputAggregateTypes=region,class
 *          inputAggregateValues=Europe,1
 *          outputAggregateTypes=benchmark,[...and others except region and class]
 *      second request:
 *          outputAggregateTypes=region,class
 *
 * @important: This approach does not solve the problem, but it allows
 *              us to provide smaller amount with inconsistent states on FE.
 *
 * @param {Config }config
 * @param {i18n} i18n
 * @param {ETFsFilters} filters
 * @param {ETFsFiltersOptions} prevFiltersOptions
 */
export default async function getEtfsFiltersOptions(config, i18n, filters, prevFiltersOptions) {
    const { searchText, feeType, popularOnly, totalExpenseRatioInterval, ...restFilters } = filters;
    const dictionary = await getDictionary(config);
    const aggregateTypes = dictionary.etfAggregateTypes.map(({ id }) => id);
    const etfAggregateParams = getEtfAggregateParams(aggregateTypes, restFilters);
    const outputAggregateTypesForValuesWithoutOptions = aggregateTypes.filter((filterKey) => !isEmptyFilterValue(restFilters[filterKey]) && !prevFiltersOptions[filterKey]);
    const valueParams = {
        etfFeeTypeId: feeType && !isFilterOptionAll(feeType) ? Number(feeType) : undefined,
        popularOnly: Boolean(popularOnly)
    };
    const [filterOptions, filterOptionsForSettledValues] = await Promise.all([
        fixBugWhenGetEtfAggregateValuesReturnsEmptyObject(await getEtfAggregateValues(config, { ...valueParams, ...etfAggregateParams }), etfAggregateParams.outputAggregateTypes),
        outputAggregateTypesForValuesWithoutOptions.length !== 0
            ? getEtfAggregateValues(config, {
                outputAggregateTypes: outputAggregateTypesForValuesWithoutOptions
            })
            : {}
    ]);
    return {
        feeType: [getFilterOptionAll(i18n), ...(dictionary.etfFeeTypes || [])],
        ...prevFiltersOptions,
        ...mapObjectByValues({ ...filterOptions, ...filterOptionsForSettledValues }, (options) => {
            return options === undefined
                ? undefined
                : isInterval(options[0])
                    ? options[0]
                    : [getFilterOptionAll(i18n), ...options];
        })
    };
}
//# sourceMappingURL=get-etfs-filters-options.js.map