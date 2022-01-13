import useMediaQuery from 'frontend-core/dist/hooks/use-media-query';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import isFilterOptionAll from 'frontend-core/dist/services/filter/is-filter-option-all';
import localize from 'frontend-core/dist/services/i18n/localize';
import getEtfDefaultFilterValues, {
    ETFsFilters as ETFsFiltersValues
} from 'frontend-core/dist/services/products/etf/get-etf-default-filter-values';
import getProductFilterNameTranslation from 'frontend-core/dist/services/products/product/get-product-filter-name-translation';
import isInfinityInterval from 'frontend-core/dist/utils/interval/is-infinity-interval';
import serializeInterval from 'frontend-core/dist/utils/interval/serialize-interval';
import getQueryString from 'frontend-core/dist/utils/url/get-query-string';
import parseUrlSearchParams from 'frontend-core/dist/utils/url/parse-url-search-params';
import * as React from 'react';
import isEmptyInterval from 'frontend-core/dist/utils/interval/is-empty-interval';
import {Interval} from 'frontend-core/dist/models/interval';
import formatInterval from 'frontend-core/dist/utils/interval/format-interval';
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
import Range from '../../range';
import SearchTextFilter from '../../filters/search-text-filter/index';
import SelectFilter from '../../filters/select-filter/index';
import SwitchFilter from '../../filters/switch-filter';
import {loadingFilter, readyFilter} from '../filters.css';
import useEtfsFiltersOptions from '../hooks/use-etfs-filters-options';
import useStateFromLocationSearch from '../../../hooks/use-state-from-location-search';
import {inlineSwitchFilterLabel} from '../products.css';
import EtfsFiltersForm from './filters-form';
import {AppApiContext, CurrentClientContext, I18nContext} from '../../app-component/app-context';
import FilterItem from '../../filters/filter-item';
import {nbsp} from '../../value';

interface Props {
    onChange: (filters: ETFsFiltersValues) => void;
}
const defaultTotalExpenseRatioIntervalBoundaries = {start: 0, end: 0};
const {useCallback, useEffect, useContext} = React;
const formatPercentagesInterval = (value: Interval<number>): [string, string] => [
    formatInterval(value, (n) => `${n}%`),
    `${nbsp}%`
];
const EtfsFilters: React.FunctionComponent<Props> = ({onChange}) => {
    const currentClient = useContext(CurrentClientContext);
    const i18n = useContext(I18nContext);
    const app = useContext(AppApiContext);
    const {data: filters, setData: setFilters} = useStateFromLocationSearch<ETFsFiltersValues>(
        (searchStr) => getEtfDefaultFilterValues(currentClient, searchStr),
        (filterValues, prevSearch) =>
            getQueryString({
                ...parseUrlSearchParams(prevSearch),
                ...filterValues,
                searchText: filterValues.searchText || undefined,
                totalExpenseRatioInterval:
                    filterValues.totalExpenseRatioInterval && serializeInterval(filterValues.totalExpenseRatioInterval)
            })
    );
    const {isLoading, value: filtersOptions, error} = useEtfsFiltersOptions(filters);
    const onFilterValueChange = useCallback((field, value) => setFilters({...filters, [field]: value}), [filters]);
    const renderFiltersForm = useCallback(
        ({closeFiltersForm}: FiltersLayoutApi) => (
            <EtfsFiltersForm
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
        <FiltersLayout data-name="etfsFilters" renderFiltersForm={renderFiltersForm}>
            {({openFiltersForm}: FiltersLayoutApi) => (
                <>
                    {!hasSmallLayout && (
                        <SearchTextFilter<ETFsFiltersValues>
                            className={`${placeholder} ${medium}`}
                            value={filters.searchText}
                            onChange={onFilterValueChange}
                            debounced={true}
                        />
                    )}
                    <SelectFilter<ETFsFiltersValues>
                        className={`${placeholder} ${medium}`}
                        field="feeType"
                        value={filters.feeType}
                        values={filtersOptions?.feeType}
                        label={localize(i18n, getProductFilterNameTranslation('feeType'))}
                        onChange={onFilterValueChange}
                    />
                    <SelectFilter<ETFsFiltersValues>
                        className={`
                            ${placeholder} ${medium} 
                            ${
                                isLoading && (!filters.exchange || isFilterOptionAll(filters.exchange))
                                    ? loadingFilter
                                    : readyFilter
                            }
                        `}
                        field="exchange"
                        value={filters.exchange}
                        values={filtersOptions?.exchange}
                        label={localize(i18n, getProductFilterNameTranslation('exchange'))}
                        onChange={onFilterValueChange}
                    />
                    {!hasSmallLayout && (
                        <>
                            <SelectFilter<ETFsFiltersValues>
                                className={`
                                    ${placeholder} ${medium}
                                    ${
                                        isLoading && (!filters.issuer || isFilterOptionAll(filters.issuer))
                                            ? loadingFilter
                                            : readyFilter
                                    }
                                `}
                                field="issuer"
                                value={filters.issuer}
                                values={filtersOptions?.issuer}
                                label={localize(i18n, getProductFilterNameTranslation('issuer'))}
                                onChange={onFilterValueChange}
                            />
                            <SelectFilter<ETFsFiltersValues>
                                className={`
                                    ${placeholder} ${medium}
                                    ${
                                        isLoading && (!filters.region || isFilterOptionAll(filters.region))
                                            ? loadingFilter
                                            : readyFilter
                                    }
                                `}
                                field="region"
                                value={filters.region}
                                values={filtersOptions?.region}
                                label={localize(i18n, getProductFilterNameTranslation('region'))}
                                onChange={onFilterValueChange}
                            />
                            <SelectFilter<ETFsFiltersValues>
                                className={`
                                    ${placeholder} ${medium}
                                    ${
                                        isLoading && (!filters.benchmark || isFilterOptionAll(filters.benchmark))
                                            ? loadingFilter
                                            : readyFilter
                                    }
                                `}
                                field="benchmark"
                                value={filters.benchmark}
                                values={filtersOptions?.benchmark}
                                label={localize(i18n, 'trader.filtersList.benchmark')}
                                onChange={onFilterValueChange}
                            />
                            <SelectFilter<ETFsFiltersValues>
                                className={`
                                    ${placeholder} ${medium}
                                    ${
                                        isLoading &&
                                        (!filters.assetAllocation || isFilterOptionAll(filters.assetAllocation))
                                            ? loadingFilter
                                            : readyFilter
                                    }
                                `}
                                field="assetAllocation"
                                value={filters.assetAllocation}
                                values={filtersOptions?.assetAllocation}
                                label={localize(i18n, 'trader.filtersList.assetAllocation')}
                                onChange={onFilterValueChange}
                            />
                            <FilterItem label={localize(i18n, 'trader.filtersList.totalExpenseRatioInterval')}>
                                <Range
                                    className={
                                        isLoading &&
                                        (!filters.totalExpenseRatioInterval ||
                                            isInfinityInterval(filters.totalExpenseRatioInterval))
                                            ? loadingFilter
                                            : readyFilter
                                    }
                                    boundaries={
                                        filtersOptions?.totalExpenseRatioInterval ||
                                        defaultTotalExpenseRatioIntervalBoundaries
                                    }
                                    disabled={isEmptyInterval(
                                        filtersOptions?.totalExpenseRatioInterval ||
                                            defaultTotalExpenseRatioIntervalBoundaries
                                    )}
                                    onChange={onFilterValueChange.bind(null, 'totalExpenseRatioInterval')}
                                    format={formatPercentagesInterval}
                                    value={filters.totalExpenseRatioInterval}
                                />
                            </FilterItem>
                            <SwitchFilter<ETFsFiltersValues>
                                className={`${placeholder} ${medium}`}
                                field="popularOnly"
                                disabled={isLoading}
                                checked={filters.popularOnly}
                                label={
                                    <span className={inlineSwitchFilterLabel}>
                                        {localize(i18n, 'trader.productsSearch.popularProducts')}
                                    </span>
                                }
                                onChange={onFilterValueChange}
                            />
                        </>
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

export default React.memo(EtfsFilters);
