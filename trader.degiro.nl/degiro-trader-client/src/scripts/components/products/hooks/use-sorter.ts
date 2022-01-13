import {SortTypes} from 'frontend-core/dist/services/filter';
import parseUrlSearchParams from 'frontend-core/dist/utils/url/parse-url-search-params';
import {useCallback} from 'react';
import useStateFromLocationSearch from '../../../hooks/use-state-from-location-search';

interface State {
    sortColumns: string[];
    sortTypes: SortTypes[];
}

interface Api {
    handleSortChange(orderBy: string, field: string): void;
    getOrderByValue(field: string): string;
}

export default function useSorter(): State & Api {
    const {
        data: {sortColumns, sortTypes},
        setData: setSortParams
    } = useStateFromLocationSearch<{
        sortColumns: string[];
        sortTypes: SortTypes[];
    }>((searchStr) => {
        const searchParams = parseUrlSearchParams(searchStr);

        return {
            sortColumns: searchParams.sortColumns?.split(',') || ['name'],
            sortTypes: !searchParams.sortTypes
                ? [SortTypes.ASC]
                : searchParams.sortTypes
                      .split(',')
                      .map((sortType) => (sortType === SortTypes.DESC ? SortTypes.DESC : SortTypes.ASC))
        };
    });
    const handleSortChange = useCallback(
        (_orderBy: string, field: string) => {
            setSortParams({
                sortColumns: [field],
                sortTypes:
                    field !== sortColumns[0] || sortTypes[0] === SortTypes.DESC ? [SortTypes.ASC] : [SortTypes.DESC]
            });
        },
        [sortColumns, sortTypes, setSortParams]
    );
    const getOrderByValue = useCallback(
        (field: string): string => {
            if (field === sortColumns[0] && sortTypes[0] === SortTypes.ASC) {
                return `+${field}`;
            }

            if (field === sortColumns[0] && sortTypes[0] === SortTypes.DESC) {
                return `-${field}`;
            }

            return field;
        },
        [sortColumns, sortTypes]
    );

    return {sortColumns, sortTypes, handleSortChange, getOrderByValue};
}
