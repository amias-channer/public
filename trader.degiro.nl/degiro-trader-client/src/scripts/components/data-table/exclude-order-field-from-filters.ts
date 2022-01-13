// do not sync order field with URL
export default function excludeOrderFieldFromFilters<F extends {orderBy?: string}>({
    orderBy,
    ...filters
}: F): Omit<F, 'orderBy'> {
    return filters;
}
