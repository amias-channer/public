import {getItem} from 'frontend-core/dist/platform/sessionstorage';
import {NewsFilters} from '../../components/markets/markets-news/filters';
import {filtersStorageKey} from '../../models/news';

export default function getFiltersSettings(): NewsFilters {
    return getItem(filtersStorageKey);
}
