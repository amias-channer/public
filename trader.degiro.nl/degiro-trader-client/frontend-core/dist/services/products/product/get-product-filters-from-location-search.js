import parseUrlSearchParams from '../../../utils/url/parse-url-search-params';
import { filterOptionAllId } from '../../filter';
import isFilterOptionAll from '../../filter/is-filter-option-all';
import deserializeInterval from '../../../utils/interval/deserialize-interval';
const getFilterValueFromQueryParameter = (key, value) => {
    if (key === 'isInUSGreenList' || key === 'popularOnly') {
        return value ? value === 'true' : undefined;
    }
    if (key === 'productTypeId') {
        return value ? String(value) : undefined;
    }
    if (key === 'totalExpenseRatioInterval') {
        return deserializeInterval(value);
    }
    // `value` could be a string '-1'
    if (isFilterOptionAll(value)) {
        return filterOptionAllId;
    }
    return value;
};
export default function getProductFiltersFromLocationSearch(search) {
    return Object.entries(parseUrlSearchParams(search)).reduce((filters, [key, value]) => {
        filters[key] = getFilterValueFromQueryParameter(key, value);
        return filters;
    }, {});
}
//# sourceMappingURL=get-product-filters-from-location-search.js.map