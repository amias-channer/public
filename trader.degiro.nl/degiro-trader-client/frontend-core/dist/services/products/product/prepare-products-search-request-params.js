import isFilterOptionAll from '../../filter/is-filter-option-all';
import filterObject from '../../../utils/filter-object';
export default function prepareProductsSearchRequestParams(params) {
    const requestParams = filterObject(params, (value) => !isFilterOptionAll(value));
    return {
        ...requestParams,
        offset: requestParams.offset || 0,
        // delete custom param from the query
        loadExchangeInfo: undefined
    };
}
//# sourceMappingURL=prepare-products-search-request-params.js.map