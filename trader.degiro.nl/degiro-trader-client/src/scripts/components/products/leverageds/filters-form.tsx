import {buttonsLine, formButton} from 'frontend-core/dist/components/ui-trader4/form/form.css';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import localize from 'frontend-core/dist/services/i18n/localize';
import {LeveragedProductsFilters as LeveragedProductsFiltersValues} from 'frontend-core/dist/services/products/leveraged/get-leveraged-product-default-filter-values';
import getProductFilterNameTranslation from 'frontend-core/dist/services/products/product/get-product-filter-name-translation';
import * as React from 'react';
import Button, {ButtonVariants} from '../../button';
import FormLineSelectFilter from '../../filters/form-line-select-filter';
import SearchTextFilter from '../../filters/search-text-filter';
import useLeveragedsFiltersOptions from '../hooks/use-leverageds-filters-options';
import {AppApiContext, I18nContext} from '../../app-component/app-context';

interface Props {
    filters: LeveragedProductsFiltersValues;
    onChange: (filters: LeveragedProductsFiltersValues) => void;
    hiddenFilters?: Array<keyof Pick<LeveragedProductsFiltersValues, 'underlying'>>;
}
const {useCallback, useState, useEffect, useContext} = React;
const LeveragedsFiltersForm: React.FunctionComponent<Props> = ({
    filters: filtersFromProps,
    hiddenFilters = [],
    onChange
}) => {
    const i18n = useContext(I18nContext);
    const app = useContext(AppApiContext);
    const [filters, setFilters] = useState<LeveragedProductsFiltersValues>(filtersFromProps);
    const [prevFilters, setPrevFilters] = useState<LeveragedProductsFiltersValues | undefined>();
    const {value: filtersOptions, error} = useLeveragedsFiltersOptions(filters, prevFilters);
    const handleFormSubmit = useCallback(() => onChange(filters), [filters, onChange]);
    const onFilterValueChange = useCallback(
        (field, value) => {
            setPrevFilters(filters);
            setFilters({...filters, [field]: value});
        },
        [filters]
    );

    useEffect(() => {
        setFilters(filtersFromProps);
        setPrevFilters(undefined);
    }, [filtersFromProps]);

    if (error) {
        logErrorLocally(error);
        app.openModal({error});
    }

    return (
        <form onSubmit={handleFormSubmit} data-name="leveragedsFiltersForm">
            <SearchTextFilter
                isFormLine={true}
                autoFocus={true}
                value={filters.searchText}
                onChange={onFilterValueChange}
            />
            <FormLineSelectFilter
                field="shortLong"
                value={filters.shortLong}
                values={filtersOptions?.shortLong}
                label={localize(i18n, getProductFilterNameTranslation('shortLong'))}
                onChange={onFilterValueChange}
            />
            <FormLineSelectFilter
                field="exchange"
                value={filters.exchange}
                values={filtersOptions?.exchange}
                label={localize(i18n, getProductFilterNameTranslation('exchange'))}
                onChange={onFilterValueChange}
            />
            {!hiddenFilters.includes('underlying') && (
                <FormLineSelectFilter
                    field="underlying"
                    value={filters.underlying}
                    values={filtersOptions?.underlying}
                    label={localize(i18n, getProductFilterNameTranslation('underlying'))}
                    onChange={onFilterValueChange}
                />
            )}
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

export default React.memo(LeveragedsFiltersForm);
