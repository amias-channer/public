import useAsyncWithProgressiveState, {UseAsyncResult} from 'frontend-core/dist/hooks/use-async-with-progressive-state';
import {ETFsFilters as ETFsFiltersValues} from 'frontend-core/dist/services/products/etf/get-etf-default-filter-values';
import getEtfsFiltersOptions, {
    ETFsFiltersOptions
} from 'frontend-core/dist/services/products/etf/get-etfs-filters-options';
import {useContext} from 'react';
import {ConfigContext, I18nContext} from '../../app-component/app-context';

export default function useEtfsFiltersOptions(filters: ETFsFiltersValues): UseAsyncResult<ETFsFiltersOptions> {
    const config = useContext(ConfigContext);
    const i18n = useContext(I18nContext);

    return useAsyncWithProgressiveState<ETFsFiltersOptions>(
        ({value = {}}) => getEtfsFiltersOptions(config, i18n, filters, value),
        [
            filters.feeType,
            filters.popularOnly,
            filters.exchange,
            filters.issuer,
            filters.region,
            filters.benchmark,
            filters.assetAllocation
        ]
    );
}
