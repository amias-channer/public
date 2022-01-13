import {FormEvent, useCallback, useEffect, useState} from 'react';

interface State<T> {
    filters: T;
}

interface Api<T> {
    setFilters(filters: T): void;
    onFilterValueChange(field: keyof T, value: T[keyof T]): void;
    onFilterValuesChange(newFilters: Partial<T>): void;
    onFiltersFormSubmit(event: FormEvent<HTMLFormElement>): void;
}

export default function useFiltersForm<T>(
    initialFilters: T,
    onFiltersSave: (filters: T) => void,
    onFilterValuesSet?: (newFilters: T, changedFilters: Array<keyof T>) => void
): State<T> & Api<T> {
    const [filters, setFilters] = useState<T>(initialFilters);
    const onFiltersFormSubmit = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            onFiltersSave({...filters});
        },
        [filters, onFiltersSave]
    );
    const onFilterValueChange = useCallback(
        (field: keyof T, value: T[keyof T]) => {
            const changedFilterFields: Array<keyof T> = [field];
            const newFilters: T = {...filters, [field]: value};

            setFilters(newFilters);
            onFilterValuesSet?.(newFilters, changedFilterFields);
        },
        [filters, onFilterValuesSet]
    );
    const onFilterValuesChange = useCallback(
        (filtersUpdate: T) => {
            const changedFilterFields = Object.keys(filtersUpdate) as Array<keyof T>;
            const newFilters: T = {...filters, ...filtersUpdate};

            setFilters(newFilters);
            onFilterValuesSet?.(newFilters, changedFilterFields);
        },
        [filters, onFilterValuesSet]
    );

    useEffect(() => setFilters(initialFilters), [initialFilters]);

    return {filters, setFilters, onFiltersFormSubmit, onFilterValueChange, onFilterValuesChange};
}
