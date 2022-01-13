import {useContext} from 'react';
import useAsyncWithProgressiveState, {UseAsyncResult} from 'frontend-core/dist/hooks/use-async-with-progressive-state';
import {LeveragedProductsFilters as LeveragedProductsFiltersValues} from 'frontend-core/dist/services/products/leveraged/get-leveraged-product-default-filter-values';
import getLeveragedProductsFiltersOptions, {
    LeveragedProductsFiltersOptions
} from 'frontend-core/dist/services/products/leveraged/get-leveraged-products-filters-options';
import {ConfigContext, I18nContext} from '../../app-component/app-context';

export default function useLeveragedsFiltersOptions(
    filters: LeveragedProductsFiltersValues,
    prevFilters: LeveragedProductsFiltersValues | undefined
): UseAsyncResult<LeveragedProductsFiltersOptions> {
    const config = useContext(ConfigContext);
    const i18n = useContext(I18nContext);

    return useAsyncWithProgressiveState<LeveragedProductsFiltersOptions>(
        ({value = {}}) => getLeveragedProductsFiltersOptions(config, i18n, filters, prevFilters, value),
        [config, i18n, filters]
    );
}
