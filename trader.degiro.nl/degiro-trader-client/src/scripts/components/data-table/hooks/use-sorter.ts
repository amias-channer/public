import {useCallback} from 'react';
import {SortTypes} from 'frontend-core/dist/services/filter';
import {SortProps} from '../sortable-column';

/**
 * @description Return field with +/- prefix
 *
 * @param {string} field
 * @param {SortTypes} sortType
 * @returns {string}
 *
 * @example:
 *  getSortKey("name", sortType.ASC) // "+name"
 *  getSortKey("name", sortType.DESC) // "-name"
 */
const getSortKey = (field: string, sortType: SortTypes): string => `${sortType === SortTypes.ASC ? '+' : '-'}${field}`;
const getSortType = (value: string, field: string): SortTypes => {
    if (getSortKey(field, SortTypes.ASC) === value) {
        return SortTypes.ASC;
    }

    if (getSortKey(field, SortTypes.DESC) === value) {
        return SortTypes.DESC;
    }

    return SortTypes.UNSORTED;
};

export default function useSorter(sortFn: (sortParam: string) => void, orderBy: string, field: string): SortProps {
    const onSort = useCallback((type: SortTypes) => sortFn(getSortKey(field, type)), [sortFn, field]);

    return {onSort, sortType: getSortType(orderBy, field)};
}
