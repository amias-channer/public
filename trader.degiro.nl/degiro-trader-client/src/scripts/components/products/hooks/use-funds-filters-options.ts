import useAsyncWithProgressiveState, {UseAsyncResult} from 'frontend-core/dist/hooks/use-async-with-progressive-state';
import {FundsFilters as FundsFiltersValues} from 'frontend-core/dist/services/products/fund/get-fund-default-filter-values';
import getFundsFiltersOptions, {
    FundsFiltersOptions
} from 'frontend-core/dist/services/products/fund/get-funds-filters-options';
import {useContext} from 'react';
import {ConfigContext, CurrentClientContext, I18nContext} from '../../app-component/app-context';

export default function useFundsFiltersOptions(filters: FundsFiltersValues): UseAsyncResult<FundsFiltersOptions> {
    const config = useContext(ConfigContext);
    const currentClient = useContext(CurrentClientContext);
    const i18n = useContext(I18nContext);

    return useAsyncWithProgressiveState<FundsFiltersOptions>(() => {
        return getFundsFiltersOptions(config, currentClient, i18n, filters);
    }, [config, currentClient, i18n, filters]);
}
