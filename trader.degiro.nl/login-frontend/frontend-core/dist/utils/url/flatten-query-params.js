import isObject from '../is-object';
function flattenValue(data) {
    let value;
    if (Array.isArray(data)) {
        value = data.map(flattenValue).join(',');
    }
    else if (isObject(data)) {
        if (data.value == null) {
            value = data.id;
        }
        else if (isObject(data.value)) {
            // for aggregate types
            value = data.value.id;
        }
        else {
            value = data.value;
        }
    }
    else {
        value = data;
    }
    return value;
}
export default function flattenQueryParams(params) {
    return Object.entries(params).reduce((result, [key, value]) => {
        // skip `null` and `undefined`
        if (value != null) {
            result[key] = flattenValue(value);
        }
        return result;
    }, {});
}
//# sourceMappingURL=flatten-query-params.js.map