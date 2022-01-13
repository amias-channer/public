import serializeInterval from 'frontend-core/dist/utils/interval/serialize-interval';
import isInterval from 'frontend-core/dist/utils/interval/is-interval';
import isInfinityInterval from 'frontend-core/dist/utils/interval/is-infinity-interval';
import {Interval} from 'frontend-core/dist/models/interval';

function serializeValue(key: string, value: Interval | Date | string[] | string | number | undefined): string {
    if ((key === 'fromDate' || key === 'toDate') && value instanceof Date) {
        return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(
            value.getDate()
        ).padStart(2, '0')}`;
    }

    if (key === 'dividendInterval' || key === 'yieldInterval' || key === 'priceInterval') {
        return serializeInterval(value as Interval);
    }

    return String(value);
}

export default function serializeAgendaSearchParams<T>(filters: T): Record<string, string> {
    return Object.entries(filters).reduce((searchParams: Record<string, string>, [key, value]) => {
        if (value === undefined || value === '' || (isInterval(value) && isInfinityInterval(value))) {
            return searchParams;
        }

        searchParams[key] = serializeValue(key, value);

        return searchParams;
    }, {} as Record<string, string>);
}
