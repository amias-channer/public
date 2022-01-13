import isFilterOptionAll from '../../filter/is-filter-option-all';
export default function excludeOptionAllParams(params) {
    if (!params) {
        return;
    }
    const result = {};
    for (const key in params) {
        if (Object.hasOwnProperty.call(params, key) && !isFilterOptionAll(params[key])) {
            result[key] = params[key];
        }
    }
    return result;
}
//# sourceMappingURL=exclude-option-all-params.js.map