import {inlineRight} from 'frontend-core/dist/components/ui-trader4/alignment-utils.css';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {I18nContext} from '../app-component/app-context';
import FiltersFormButtonsLine from '../filters/filters-form-buttons-line';
import useFiltersForm from '../filters/hooks/use-filters-form';
import PeriodFilter, {PeriodBoundaries, PeriodFilterValues} from '../filters/period-filter/index';
import SearchTextFilter from '../filters/search-text-filter/index';
import SwitchFilter from '../filters/switch-filter';
import Hint from '../hint/index';
import {TransactionsFiltersProps} from './filters';

interface Props extends TransactionsFiltersProps {
    periodBoundaries: PeriodBoundaries;
}

const {useContext, useMemo} = React;
const TransactionsFiltersForm: React.FunctionComponent<Props> = ({
    periodOptions,
    periodBoundaries,
    filters: filtersFromProps,
    onSave
}) => {
    const i18n = useContext(I18nContext);
    const {filters, onFiltersFormSubmit, onFilterValueChange, onFilterValuesChange} = useFiltersForm(
        filtersFromProps,
        onSave
    );
    const periodFilterValues: Partial<PeriodFilterValues> = useMemo(
        () => ({
            fromDate: filters.fromDate,
            toDate: filters.toDate
        }),
        [filters]
    );

    return (
        <form onSubmit={onFiltersFormSubmit} data-name="transactionsFiltersForm">
            <SearchTextFilter
                autoFocus={true}
                isFormLine={true}
                value={filters.searchText}
                onChange={onFilterValueChange}
            />
            <PeriodFilter
                isFormLine={true}
                options={periodOptions}
                values={periodFilterValues}
                onChange={onFilterValuesChange}
                boundaries={periodBoundaries}
            />
            <SwitchFilter
                label={localize(i18n, 'trader.transactions.aggregateTransactions')}
                checked={filters.groupTransactionsByOrder}
                field="groupTransactionsByOrder"
                isFormLine={true}
                onChange={onFilterValueChange}>
                <Hint
                    className={inlineRight}
                    content={localize(i18n, 'trader.transactions.aggregateTransactionsHint')}
                />
            </SwitchFilter>
            <FiltersFormButtonsLine />
        </form>
    );
};

export default React.memo(TransactionsFiltersForm);
