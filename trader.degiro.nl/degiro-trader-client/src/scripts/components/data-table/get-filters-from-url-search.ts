import parseDate from 'frontend-core/dist/utils/date/parse-date';
import toBoolean from 'frontend-core/dist/utils/to-boolean';
import parseUrlSearchParams from 'frontend-core/dist/utils/url/parse-url-search-params';

const booleanValues: string[] = ['true', 'false'];

export default function getFiltersFromUrlSearch<T extends object>(search: string, dateValueFields: string[]): T {
    return Object.entries(parseUrlSearchParams(search)).reduce((urlFilters: {[key: string]: any}, [field, value]) => {
        if (dateValueFields.includes(field)) {
            urlFilters[field] = parseDate(value);
        } else if (booleanValues.includes(value)) {
            urlFilters[field] = toBoolean(value);
        } else {
            // do not store empty strings
            urlFilters[field] = value || undefined;
        }

        return urlFilters;
    }, {}) as T;
}
