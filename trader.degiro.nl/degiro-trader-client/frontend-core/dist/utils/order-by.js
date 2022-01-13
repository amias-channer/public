import getNestedValue from './get-nested-value';
import pipe from './pipe';
// path param can be prefixed by "+" or "-" for ascending and descending sorting
// Note: We can use [].revere() instead of specifying "-" or "+" as sorting parameters.
//       Or we can use function sortBy https://ramdajs.com/docs/#sortBy
export default function orderBy(list, path) {
    if (!path || !Array.isArray(list)) {
        return list;
    }
    const comparatorWeight = path[0] === '-' ? -1 : 1;
    path = path.replace(/^[+-]/, '');
    const mapFn = pipe((value) => getNestedValue(value, path), (value) => (typeof value === 'string' ? value.trim().toLowerCase() : value));
    return [...list].sort((a, b) => {
        const aValue = mapFn(a);
        // Set to empty string when one of the values is undefined to comparison work as intended
        // [WF-1977] keep dashes in the end
        if (aValue === undefined) {
            return 1;
        }
        const bValue = mapFn(b);
        // [WF-1977] keep dashes in the end
        if (bValue === undefined) {
            return -1;
        }
        if (aValue > bValue) {
            return comparatorWeight;
        }
        if (aValue < bValue) {
            return -comparatorWeight;
        }
        return 0;
    });
}
//# sourceMappingURL=order-by.js.map