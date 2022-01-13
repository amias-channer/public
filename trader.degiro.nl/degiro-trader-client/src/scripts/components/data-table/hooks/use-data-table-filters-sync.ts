import {Dispatch, SetStateAction, useEffect, useRef, useState} from 'react';
import {useHistory} from 'react-router-dom';
import updateUrlSearchParams from '../../../services/router/update-url-search-params';
import excludeOrderFieldFromFilters from '../exclude-order-field-from-filters';
import getFiltersFromUrlSearch from '../get-filters-from-url-search';
import getUrlParamsFromFilters from '../get-url-params-from-filters';

export default function useDataTableFiltersSync<F extends object>(
    initialFilters: F,
    options?: {
        dateValueFields?: string[];
        mapFromUrlFilters?: (filters: Partial<F>) => Partial<F>;
        mapToUrlFilters?: (filters: F) => Partial<F>;
    }
): [F, Dispatch<SetStateAction<F>>] {
    const history = useHistory();
    const {
        dateValueFields = ['fromDate', 'toDate'],
        mapFromUrlFilters = excludeOrderFieldFromFilters,
        mapToUrlFilters = excludeOrderFieldFromFilters
    } = options || {};
    const lastSyncedSearchRef = useRef<string>('');
    const [filters, setFilters] = useState<F>(initialFilters);
    const {search: currentSearch} = history.location;

    useEffect(() => {
        if (lastSyncedSearchRef.current !== currentSearch) {
            lastSyncedSearchRef.current = currentSearch;
            setFilters((filters) => ({
                ...filters,
                ...mapFromUrlFilters(getFiltersFromUrlSearch<Partial<F>>(currentSearch, dateValueFields))
            }));
        }
    }, [currentSearch]);

    useEffect(() => {
        const {search} = updateUrlSearchParams(history, {
            params: getUrlParamsFromFilters(mapToUrlFilters(filters))
        });

        lastSyncedSearchRef.current = search;
    }, [filters]);

    return [filters, setFilters];
}
