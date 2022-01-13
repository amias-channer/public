const squareBracketsPattern = /\[['"]*|['"]*]/;
function splitPath(path) {
    return path.split('.').reduce((result, prop) => {
        const subProps = prop.includes('[') ? prop.split(squareBracketsPattern).filter((prop) => prop) : [prop];
        return result.concat(subProps);
    }, []);
}
function getProp(value, prop) {
    return value ? value[prop] : value;
}
/**
 * @description Returns the nested property/value of the `source` by path.
 * @param {*} source
 * @param {string} path
 * @returns {*}
 */
export default function getNestedValue(source, path) {
    return path ? splitPath(path).reduce(getProp, source) : undefined;
}
//# sourceMappingURL=get-nested-value.js.map