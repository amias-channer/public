import {setItem} from 'frontend-core/dist/platform/sessionstorage';
import {NewsFilters} from '../../components/markets/markets-news/filters';
import {filtersStorageKey} from '../../models/news';

export default function saveFiltersSettings(value: NewsFilters): void {
    return setItem(filtersStorageKey, value);
}
