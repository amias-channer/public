import {inlineRight} from 'frontend-core/dist/components/ui-trader4/alignment-utils.css';
import useMediaQuery from 'frontend-core/dist/hooks/use-media-query';
import {FilterPeriodOptions} from 'frontend-core/dist/services/filter/get-filter-period';
import localize from 'frontend-core/dist/services/i18n/localize';
import {minDate} from 'frontend-core/dist/utils/date/constants';
import * as React from 'react';
import {filtersLargeLayout, filtersMediumLayout} from '../../media-queries';
import {ConfigContext, I18nContext} from '../app-component/app-context';
import {FiltersProps} from '../filters';
import CollapsedFiltersButton from '../filters/collapsed-filters-button';
import CollapsedSearchButton from '../filters/collapsed-search-button';
import ExportButton from '../filters/export-button';
import FiltersLayout, {FiltersLayoutApi} from '../filters/filters-layout';
import {
    alignAuto,
    end,
    large,
    medium,
    placeholder,
    preservedLabelSpace,
    top
} from '../filters/filters-layout/filters-layout.css';
import useFiltersChangeHandlers from '../filters/hooks/use-filters-change-handlers';
import PeriodFilter, {PeriodBoundaries, PeriodFilterValues} from '../filters/period-filter';
import SearchTextFilter from '../filters/search-text-filter/index';
import SwitchFilter from '../filters/switch-filter';
import Hint from '../hint';
import TransactionsFiltersForm from './filters-form';

export interface TransactionsFiltersData {
    orderBy: string;
    fromDate: Date;
    toDate: Date;
    groupTransactionsByOrder?: boolean;
    searchText?: string;
}

export interface TransactionsFiltersProps extends FiltersProps<TransactionsFiltersData> {
    periodOptions: FilterPeriodOptions;
}

const {useCallback, useMemo, useContext} = React;
const TransactionsFilters: React.FunctionComponent<TransactionsFiltersProps> = (props) => {
    const i18n = useContext(I18nContext);
    const {reportingUrl} = useContext(ConfigContext);
    const {filters, periodOptions, onSave} = props;
    const {groupTransactionsByOrder, searchText} = filters;
    const {onFilterValueChange, onFilterValuesChange} = useFiltersChangeHandlers<TransactionsFiltersData>(
        filters,
        onSave
    );
    const periodBoundaries: PeriodBoundaries = useMemo(() => ({start: minDate, end: new Date()}), []);
    const renderFiltersForm = useCallback(
        ({closeFiltersForm}: FiltersLayoutApi) => (
            <TransactionsFiltersForm
                {...props}
                periodBoundaries={periodBoundaries}
                /* eslint-disable-next-line react/jsx-no-bind */
                onSave={(filters: TransactionsFiltersData) => {
                    closeFiltersForm();
                    onSave(filters);
                }}
            />
        ),
        [props, onSave, periodBoundaries]
    );
    const hasMediumLayout = useMediaQuery(filtersMediumLayout);
    const hasLargeLayout = useMediaQuery(filtersLargeLayout);
    const hasSmallLayout = !hasMediumLayout && !hasLargeLayout;
    const periodFilterValues: Partial<PeriodFilterValues> = useMemo(
        () => ({
            fromDate: filters.fromDate,
            toDate: filters.toDate
        }),
        [filters]
    );

    return (
        <FiltersLayout data-name="transactionsFilters" renderFiltersForm={renderFiltersForm}>
            {({openFiltersForm}: FiltersLayoutApi) => (
                <>
                    {!hasSmallLayout && (
                        <SearchTextFilter<TransactionsFiltersData>
                            className={`${placeholder} ${hasLargeLayout ? large : medium}`}
                            value={searchText}
                            onChange={onFilterValueChange}
                        />
                    )}
                    <PeriodFilter
                        className={`${placeholder} ${hasSmallLayout ? medium : large}`}
                        options={periodOptions}
                        values={periodFilterValues}
                        onChange={onFilterValuesChange}
                        boundaries={periodBoundaries}
                    />
                    {hasLargeLayout && (
                        <SwitchFilter
                            className={`${placeholder} ${medium}`}
                            label={localize(i18n, 'trader.transactions.aggregateTransactions')}
                            checked={groupTransactionsByOrder}
                            field="groupTransactionsByOrder"
                            onChange={onFilterValueChange}>
                            <Hint
                                className={inlineRight}
                                content={localize(i18n, 'trader.transactions.aggregateTransactionsHint')}
                            />
                        </SwitchFilter>
                    )}
                    <div className={`${placeholder} ${medium} ${preservedLabelSpace} ${alignAuto} ${top} ${end}`}>
                        {hasSmallLayout && (
                            <CollapsedSearchButton isActive={Boolean(searchText)} onClick={openFiltersForm} />
                        )}
                        {reportingUrl && (
                            <ExportButton
                                collapsed={!hasLargeLayout}
                                fromDate={filters.fromDate}
                                toDate={filters.toDate}
                                reportUrlParams={groupTransactionsByOrder ? {groupTransactionsByOrder} : undefined}
                                reportBaseUrl={`${reportingUrl}v3/transactionReport/`}
                            />
                        )}
                        {!hasLargeLayout && <CollapsedFiltersButton onClick={openFiltersForm} />}
                    </div>
                </>
            )}
        </FiltersLayout>
    );
};

export default React.memo(TransactionsFilters);
