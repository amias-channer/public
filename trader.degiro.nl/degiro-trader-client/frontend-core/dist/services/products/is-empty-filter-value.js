import isFilterOptionAll from '../filter/is-filter-option-all';
import isInterval from '../../utils/interval/is-interval';
import isInfinityInterval from '../../utils/interval/is-infinity-interval';
export default function isEmptyFilterValue(filterValue) {
    return (filterValue === undefined ||
        isFilterOptionAll(filterValue) ||
        (isInterval(filterValue) && isInfinityInterval(filterValue)));
}
//# sourceMappingURL=is-empty-filter-value.js.map