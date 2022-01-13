import useMediaQuery from 'frontend-core/dist/hooks/use-media-query';
import {FilterPeriodOptions} from 'frontend-core/dist/services/filter/get-filter-period';
import {minDate} from 'frontend-core/dist/utils/date/constants';
import * as React from 'react';
import {filtersMediumLayout} from '../../media-queries';
import {FiltersProps} from '../filters';
import FiltersLayout from '../filters/filters-layout';
import {large, placeholder, xLarge} from '../filters/filters-layout/filters-layout.css';
import useFiltersChangeHandlers from '../filters/hooks/use-filters-change-handlers';
import PeriodFilter, {PeriodBoundaries, PeriodFilterValues} from '../filters/period-filter/index';

export interface PortfolioDepreciationFiltersData {
    orderBy: string;
    fromDate?: Date;
    toDate?: Date;
}

interface Props extends FiltersProps<PortfolioDepreciationFiltersData> {
    periodOptions: FilterPeriodOptions;
}

const {useMemo} = React;
const PortfolioDepreciationFilters: React.FunctionComponent<Props> = ({filters, periodOptions, onSave}) => {
    const {onFilterValuesChange} = useFiltersChangeHandlers<PortfolioDepreciationFiltersData>(filters, onSave);
    const hasSmallLayout = !useMediaQuery(filtersMediumLayout);
    const periodBoundaries: PeriodBoundaries = useMemo(() => ({start: minDate, end: new Date()}), []);
    const periodFilterValues: Partial<PeriodFilterValues> = useMemo(
        () => ({
            fromDate: filters.fromDate,
            toDate: filters.toDate
        }),
        [filters]
    );

    return (
        <FiltersLayout data-name="portfolioDepreciationFilters">
            {() => (
                <PeriodFilter
                    className={`${placeholder} ${hasSmallLayout ? xLarge : large}`}
                    options={periodOptions}
                    values={periodFilterValues}
                    onChange={onFilterValuesChange}
                    boundaries={periodBoundaries}
                />
            )}
        </FiltersLayout>
    );
};

export default React.memo(PortfolioDepreciationFilters);
