import {buttonsLine, formButton} from 'frontend-core/dist/components/ui-trader4/form/form.css';
import useStateFromProp from 'frontend-core/dist/hooks/use-state-from-prop';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {Interval} from 'frontend-core/dist/models/interval';
import localize from 'frontend-core/dist/services/i18n/localize';
import {ETFsFilters as ETFsFiltersValues} from 'frontend-core/dist/services/products/etf/get-etf-default-filter-values';
import getProductFilterNameTranslation from 'frontend-core/dist/services/products/product/get-product-filter-name-translation';
import * as React from 'react';
import formatInterval from 'frontend-core/dist/utils/interval/format-interval';
import isEmptyInterval from 'frontend-core/dist/utils/interval/is-empty-interval';
import Button, {ButtonVariants} from '../../button';
import FormLineSelectFilter from '../../filters/form-line-select-filter';
import SearchTextFilter from '../../filters/search-text-filter/index';
import SwitchFilter from '../../filters/switch-filter';
import useEtfsFiltersOptions from '../hooks/use-etfs-filters-options';
import {AppApiContext, I18nContext} from '../../app-component/app-context';
import FormLineFilterItem from '../../filters/form-line-filter-item';
import RangeInline from '../../range/range-inline';
import {nbsp} from '../../value';

interface Props {
    filters: ETFsFiltersValues;
    onChange: (filters: ETFsFiltersValues) => void;
}

const {useCallback, useContext, memo} = React;
const defaultTotalExpenseRatioBoundaries: Interval = {start: 0, end: 0};
const formatPercentages = (value: Interval): [string, string] => [formatInterval(value, (n) => `${n}%`), `${nbsp}%`];
const EtfsFiltersForm = memo<Props>(({onChange, filters: filtersFromProps}) => {
    const i18n = useContext(I18nContext);
    const app = useContext(AppApiContext);
    const [filters, setFilters] = useStateFromProp<ETFsFiltersValues>(filtersFromProps);
    const {isLoading, value: filtersOptions, error} = useEtfsFiltersOptions(filters);
    const onFilterValueChange = useCallback((field, value) => {
        return setFilters((filters: ETFsFiltersValues) => ({...filters, [field]: value}));
    }, []);
    const handleFormSubmit = useCallback(() => onChange(filters), [filters, onChange]);

    if (error) {
        logErrorLocally(error);
        app.openModal({error});
    }

    return (
        <form onSubmit={handleFormSubmit} data-name="etfsFiltersForm">
            <SearchTextFilter<ETFsFiltersValues>
                autoFocus={true}
                isFormLine={true}
                value={filters.searchText}
                onChange={onFilterValueChange}
            />
            <FormLineSelectFilter<ETFsFiltersValues>
                field="feeType"
                value={filters.feeType}
                values={filtersOptions?.feeType}
                label={localize(i18n, getProductFilterNameTranslation('feeType'))}
                onChange={onFilterValueChange}
            />
            <FormLineSelectFilter<ETFsFiltersValues>
                field="exchange"
                value={filters.exchange}
                values={filtersOptions?.exchange}
                label={localize(i18n, getProductFilterNameTranslation('exchange'))}
                onChange={onFilterValueChange}
            />
            <FormLineSelectFilter<ETFsFiltersValues>
                field="issuer"
                value={filters.issuer}
                values={filtersOptions?.issuer}
                label={localize(i18n, getProductFilterNameTranslation('issuer'))}
                onChange={onFilterValueChange}
            />
            <FormLineSelectFilter<ETFsFiltersValues>
                field="region"
                value={filters.region}
                values={filtersOptions?.region}
                label={localize(i18n, getProductFilterNameTranslation('region'))}
                onChange={onFilterValueChange}
            />
            <FormLineSelectFilter<ETFsFiltersValues>
                field="benchmark"
                value={filters.benchmark}
                values={filtersOptions?.benchmark}
                label={localize(i18n, localize(i18n, 'trader.filtersList.benchmark'))}
                onChange={onFilterValueChange}
            />
            <FormLineSelectFilter<ETFsFiltersValues>
                field="assetAllocation"
                value={filters.assetAllocation}
                values={filtersOptions?.assetAllocation}
                label={localize(i18n, localize(i18n, 'trader.filtersList.assetAllocation'))}
                onChange={onFilterValueChange}
            />
            <FormLineFilterItem
                label={localize(i18n, 'trader.filtersList.totalExpenseRatioInterval')}
                disabled={isEmptyInterval(
                    filtersOptions?.totalExpenseRatioInterval || defaultTotalExpenseRatioBoundaries
                )}>
                <RangeInline
                    value={filters.totalExpenseRatioInterval}
                    boundaries={filtersOptions?.totalExpenseRatioInterval || defaultTotalExpenseRatioBoundaries}
                    onChange={onFilterValueChange.bind(null, 'totalExpenseRatioInterval')}
                    format={formatPercentages}
                />
            </FormLineFilterItem>
            <SwitchFilter
                field="popularOnly"
                isFormLine={true}
                disabled={isLoading}
                checked={filters.popularOnly}
                label={localize(i18n, 'trader.productsSearch.popularProducts')}
                onChange={onFilterValueChange}
            />
            <div className={buttonsLine}>
                <Button type="submit" variant={ButtonVariants.ACCENT} className={formButton}>
                    {localize(i18n, 'trader.filters.showResults')}
                </Button>
            </div>
        </form>
    );
});

EtfsFiltersForm.displayName = 'EtfsFiltersForm';
export default EtfsFiltersForm;
