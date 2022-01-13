import {User} from 'frontend-core/dist/models/user';
import {filterOptionAllId} from 'frontend-core/dist/services/filter';
import getProductDefaultFilterValue from 'frontend-core/dist/services/products/product/get-product-default-filter-value';
import getProductFiltersFromLocationSearch from 'frontend-core/dist/services/products/product/get-product-filters-from-location-search';
import {Location} from 'history';
import {OptionsFilters} from './filters-manager';

export default function getOptionDefaultFilterValues(client: User, location: Location): OptionsFilters {
    const filters = getProductFiltersFromLocationSearch<OptionsFilters>(location.search);
    const {defaultOptionExchangeId, defaultOptionUnderlyingIsin, defaultOptionCountryId} = client.settings || {};

    return {
        ...filters,
        country: getProductDefaultFilterValue(filters.country, defaultOptionCountryId),
        exchange: getProductDefaultFilterValue(filters.exchange, defaultOptionExchangeId),
        underlying: getProductDefaultFilterValue(filters.underlying, defaultOptionUnderlyingIsin),
        strikeType: getProductDefaultFilterValue(filters.strikeType, filterOptionAllId),
        activeStrikeThreshold: 0.1
    };
}
