import {buttonsLine, formButton} from 'frontend-core/dist/components/ui-trader4/form/form.css';
import useStateFromProp from 'frontend-core/dist/hooks/use-state-from-prop';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import localize from 'frontend-core/dist/services/i18n/localize';
import {FundsFilters as FundsFiltersValues} from 'frontend-core/dist/services/products/fund/get-fund-default-filter-values';
import getProductFilterNameTranslation from 'frontend-core/dist/services/products/product/get-product-filter-name-translation';
import * as React from 'react';
import Button, {ButtonVariants} from '../../button';
import FormLineSelectFilter from '../../filters/form-line-select-filter';
import SearchTextFilter from '../../filters/search-text-filter/index';
import useFundsFiltersOptions from '../hooks/use-funds-filters-options';
import {AppApiContext, I18nContext} from '../../app-component/app-context';

interface Props {
    filters: FundsFiltersValues;
    onChange: (filters: FundsFiltersValues) => void;
}
const {useCallback, useContext} = React;
const FundsFiltersForm: React.FunctionComponent<Props> = ({filters: filtersFromProps, onChange}) => {
    const i18n = useContext(I18nContext);
    const app = useContext(AppApiContext);
    const [filters, setFilters] = useStateFromProp<FundsFiltersValues>(filtersFromProps);
    const {value: filtersOptions, error} = useFundsFiltersOptions(filters);
    const onFilterValueChange = useCallback((field, value) => {
        return setFilters((filters: FundsFiltersValues) => ({...filters, [field]: value}));
    }, []);
    const handleFormSubmit = useCallback(() => onChange(filters), [filters, onChange]);

    if (error) {
        logErrorLocally(error);
        app.openModal({error});
    }

    return (
        <form onSubmit={handleFormSubmit} data-name="fundsFiltersForm">
            <SearchTextFilter
                autoFocus={true}
                isFormLine={true}
                value={filters.searchText}
                onChange={onFilterValueChange}
            />
            <FormLineSelectFilter
                field="feeType"
                value={filters.feeType}
                values={filtersOptions?.feeType}
                label={localize(i18n, getProductFilterNameTranslation('feeType'))}
                onChange={onFilterValueChange}
            />
            <FormLineSelectFilter
                field="issuer"
                value={filters.issuer}
                values={filtersOptions?.issuer}
                label={localize(i18n, getProductFilterNameTranslation('issuer'))}
                onChange={onFilterValueChange}
            />
            <div className={buttonsLine}>
                <Button type="submit" variant={ButtonVariants.ACCENT} className={formButton}>
                    {localize(i18n, 'trader.filters.showResults')}
                </Button>
            </div>
        </form>
    );
};

export default React.memo(FundsFiltersForm);
