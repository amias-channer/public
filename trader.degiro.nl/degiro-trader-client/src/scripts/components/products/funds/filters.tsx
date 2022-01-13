import {SelectSizes} from 'frontend-core/dist/components/ui-trader4/select';
import useMediaQuery from 'frontend-core/dist/hooks/use-media-query';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import localize from 'frontend-core/dist/services/i18n/localize';
import getFundDefaultFilterValues, {
    FundsFilters as FundsFiltersValues
} from 'frontend-core/dist/services/products/fund/get-fund-default-filter-values';
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
    large,
    medium,
    placeholder,
    preservedLabelSpace,
    small,
    top
} from '../../filters/filters-layout/filters-layout.css';
import SearchTextFilter from '../../filters/search-text-filter/index';
import SelectFilter from '../../filters/select-filter/index';
import useFundsFiltersOptions from '../hooks/use-funds-filters-options';
import useStateFromLocationSearch from '../../../hooks/use-state-from-location-search';
import FundsFiltersForm from './filters-form';
import {AppApiContext, CurrentClientContext, I18nContext} from '../../app-component/app-context';

interface Props {
    onChange: (filters: FundsFiltersValues) => void;
}

const {useCallback, useEffect, useContext} = React;
const FundsFilters: React.FunctionComponent<Props> = ({onChange}) => {
    const currentClient = useContext(CurrentClientContext);
    const i18n = useContext(I18nContext);
    const app = useContext(AppApiContext);
    const {data: filters, setData: setFilters} = useStateFromLocationSearch<FundsFiltersValues>(
        (searchStr) => getFundDefaultFilterValues(currentClient, searchStr),
        ({searchText, feeType, issuer}, prevSearch) =>
            getQueryString({
                ...parseUrlSearchParams(prevSearch),
                searchText: searchText || undefined,
                feeType,
                issuer
            })
    );
    const {value: filtersOptions, error} = useFundsFiltersOptions(filters);
    const hasSmallLayout = !useMediaQuery(filtersMediumLayout);
    const onFilterValueChange = useCallback((field, value) => setFilters({...filters, [field]: value}), [filters]);
    const renderFiltersForm = useCallback(
        ({closeFiltersForm}: FiltersLayoutApi) => (
            <FundsFiltersForm
                filters={filters}
                /* eslint-disable-next-line react/jsx-no-bind */
                onChange={(filters: FundsFiltersValues) => {
                    closeFiltersForm();
                    setFilters(filters);
                }}
            />
        ),
        [filters]
    );

    useEffect(() => onChange(filters), [filters]);

    if (error) {
        logErrorLocally(error);
        app.openModal({error});
    }

    return (
        <FiltersLayout data-name="fundsFilters" renderFiltersForm={renderFiltersForm}>
            {({openFiltersForm}: FiltersLayoutApi) => (
                <>
                    {!hasSmallLayout && (
                        <SearchTextFilter<FundsFiltersValues>
                            className={`${placeholder} ${large}`}
                            value={filters.searchText}
                            onChange={onFilterValueChange}
                            debounced={true}
                        />
                    )}
                    <SelectFilter<FundsFiltersValues>
                        className={`${placeholder} ${medium}`}
                        size={SelectSizes.WIDE}
                        field="feeType"
                        value={filters.feeType}
                        values={filtersOptions?.feeType}
                        label={localize(i18n, getProductFilterNameTranslation('feeType'))}
                        onChange={onFilterValueChange}
                    />
                    <SelectFilter<FundsFiltersValues>
                        className={`${placeholder} ${medium}`}
                        size={SelectSizes.WIDE}
                        field="issuer"
                        value={filters.issuer}
                        values={filtersOptions?.issuer}
                        label={localize(i18n, getProductFilterNameTranslation('issuer'))}
                        onChange={onFilterValueChange}
                    />
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

export default React.memo(FundsFilters);
