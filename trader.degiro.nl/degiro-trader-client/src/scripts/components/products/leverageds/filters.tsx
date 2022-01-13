import {SelectSizes} from 'frontend-core/dist/components/ui-trader4/select/index';
import useMediaQuery from 'frontend-core/dist/hooks/use-media-query';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import localize from 'frontend-core/dist/services/i18n/localize';
import getLeveragedProductDefaultFilterValues, {
    LeveragedProductsFilters as LeveragedProductsFiltersValues
} from 'frontend-core/dist/services/products/leveraged/get-leveraged-product-default-filter-values';
import getProductFilterNameTranslation from 'frontend-core/dist/services/products/product/get-product-filter-name-translation';
import getQueryString from 'frontend-core/dist/utils/url/get-query-string';
import parseUrlSearchParams from 'frontend-core/dist/utils/url/parse-url-search-params';
import * as React from 'react';
import {filtersMediumLayout} from '../../../media-queries';
import CollapsedFiltersButton from '../../filters/collapsed-filters-button';
import FiltersLayout, {FiltersLayoutApi} from '../../filters/filters-layout';
import {
    alignAuto,
    end,
    medium,
    placeholder,
    preservedLabelSpace,
    small,
    top
} from '../../filters/filters-layout/filters-layout.css';
import SearchTextFilter from '../../filters/search-text-filter/index';
import SelectFilter from '../../filters/select-filter/index';
import useLeveragedsFiltersOptions from '../hooks/use-leverageds-filters-options';
import useStateFromLocationSearch from '../../../hooks/use-state-from-location-search';
import LeveragedsFiltersForm from './filters-form';
import {AppApiContext, CurrentClientContext, I18nContext} from '../../app-component/app-context';

export interface LeveragedsFiltersProps {
    onChange: (filters: LeveragedProductsFiltersValues) => void;
    hiddenFilters?: Array<keyof Pick<LeveragedProductsFiltersValues, 'underlying'>>;
}

const {useCallback, useEffect, useContext} = React;
const LeveragedsFilters: React.FunctionComponent<LeveragedsFiltersProps> = ({hiddenFilters = [], onChange}) => {
    const currentClient = useContext(CurrentClientContext);
    const i18n = useContext(I18nContext);
    const app = useContext(AppApiContext);
    const {
        data: filters,
        prevData: prevFilters,
        setData: setFilters
    } = useStateFromLocationSearch<LeveragedProductsFiltersValues>(
        (searchStr) => getLeveragedProductDefaultFilterValues(currentClient, searchStr),
        (filterValues, prevSearch) =>
            getQueryString({
                ...parseUrlSearchParams(prevSearch),
                ...filterValues,
                searchText: filterValues.searchText || undefined
            })
    );
    const {value: filtersOptions, error} = useLeveragedsFiltersOptions(filters, prevFilters);
    const onFilterValueChange = useCallback((field, value) => setFilters({...filters, [field]: value}), [filters]);
    const renderFiltersForm = useCallback(
        ({closeFiltersForm}: FiltersLayoutApi) => (
            <LeveragedsFiltersForm
                filters={filters}
                /* eslint-disable-next-line react/jsx-no-bind */
                onChange={(filters) => {
                    closeFiltersForm();
                    setFilters(filters);
                }}
            />
        ),
        [filters]
    );
    const hasSmallLayout = !useMediaQuery(filtersMediumLayout);

    useEffect(() => onChange(filters), [filters]);

    if (error) {
        logErrorLocally(error);
        app.openModal({error});
    }

    return (
        <FiltersLayout data-name="leveragedsFilters" renderFiltersForm={renderFiltersForm}>
            {({openFiltersForm}: FiltersLayoutApi) => (
                <>
                    {!hasSmallLayout && (
                        <SearchTextFilter<LeveragedProductsFiltersValues>
                            className={`${placeholder} ${medium}`}
                            value={filters.searchText}
                            onChange={onFilterValueChange}
                            debounced={true}
                        />
                    )}
                    <SelectFilter<LeveragedProductsFiltersValues>
                        className={`${placeholder} ${medium}`}
                        size={SelectSizes.WIDE}
                        field="shortLong"
                        value={filters.shortLong}
                        values={filtersOptions?.shortLong}
                        label={localize(i18n, getProductFilterNameTranslation('shortLong'))}
                        onChange={onFilterValueChange}
                    />
                    <SelectFilter<LeveragedProductsFiltersValues>
                        className={`${placeholder} ${medium}`}
                        size={SelectSizes.WIDE}
                        field="exchange"
                        value={filters.exchange}
                        values={filtersOptions?.exchange}
                        label={localize(i18n, getProductFilterNameTranslation('exchange'))}
                        onChange={onFilterValueChange}
                    />
                    {!hasSmallLayout && !hiddenFilters.includes('underlying') && (
                        <SelectFilter<LeveragedProductsFiltersValues>
                            className={`${placeholder} ${medium}`}
                            size={SelectSizes.WIDE}
                            field="underlying"
                            value={filters.underlying}
                            values={filtersOptions?.underlying}
                            label={localize(i18n, getProductFilterNameTranslation('underlying'))}
                            onChange={onFilterValueChange}
                        />
                    )}
                    {!hasSmallLayout && (
                        <SelectFilter<LeveragedProductsFiltersValues>
                            className={`${placeholder} ${medium}`}
                            size={SelectSizes.WIDE}
                            field="issuer"
                            value={filters.issuer}
                            values={filtersOptions?.issuer}
                            label={localize(i18n, getProductFilterNameTranslation('issuer'))}
                            onChange={onFilterValueChange}
                        />
                    )}
                    {hasSmallLayout && (
                        <CollapsedFiltersButton
                            className={`${placeholder} ${small} ${preservedLabelSpace} ${alignAuto} ${top} ${end}`}
                            onClick={openFiltersForm}
                        />
                    )}
                </>
            )}
        </FiltersLayout>
    );
};

export default React.memo(LeveragedsFilters);
