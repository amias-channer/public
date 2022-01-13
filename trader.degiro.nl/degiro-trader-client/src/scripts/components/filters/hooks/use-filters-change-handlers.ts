import {useCallback} from 'react';

export default function useFiltersChangeHandlers<T extends object>(filters: T, onSave: (filters: T) => void) {
    const onFilterValuesChange = useCallback((filtersUpdate: Partial<T>) => onSave({...filters, ...filtersUpdate}), [
        onSave,
        filters
    ]);
    const onFilterValueChange = useCallback(
        (field: keyof T, value: T[keyof T]) => onSave({...filters, [field]: value}),
        [onSave, filters]
    );

    return {onFilterValuesChange, onFilterValueChange};
}
