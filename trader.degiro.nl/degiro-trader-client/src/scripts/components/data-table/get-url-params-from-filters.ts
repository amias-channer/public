import formatDate from 'frontend-core/dist/utils/date/format-date';

type UrlParams = Record<string, string | undefined>;

export default function getUrlParamsFromFilters<T extends {[key: string]: any}>(filters: T): UrlParams {
    return Object.entries(filters).reduce((urlParams: UrlParams, [field, value]) => {
        // do not save empty strings, NaN, null, etc. in URL but override previous values
        if (!value && value !== 0 && value !== false) {
            urlParams[field] = undefined;
        } else if (value instanceof Date) {
            urlParams[field] = formatDate(value, 'YYYY-MM-DD');
        } else {
            urlParams[field] = String(value);
        }

        return urlParams;
    }, {});
}
