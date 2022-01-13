import useStateFromProp from 'frontend-core/dist/hooks/use-state-from-prop';
import {Interval} from 'frontend-core/dist/models/interval';
import getFilterPeriod, {DateRange, FilterPeriodOptions} from 'frontend-core/dist/services/filter/get-filter-period';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {I18nContext} from '../../app-component/app-context';
import DatePicker from '../../datepicker/index';
import {filterLabel, outlinedControl} from '../filters.css';
import {FilterProps} from '../index';
import {filtersSection, filtersSectionAsRow, formLine, formLineLabel, section} from './period-filter.css';

export interface PeriodFilterValues {
    fromDate: Date;
    toDate: Date;
}

export type PeriodBoundaries = Interval<Date>;

interface Props extends Pick<FilterProps, 'field' | 'outlined' | 'isFormLine'> {
    className?: string;
    options?: FilterPeriodOptions;
    values: Partial<PeriodFilterValues>;
    boundaries?: PeriodBoundaries;
    onChange(filters: PeriodFilterValues): void;
}

const {useCallback, useContext} = React;
/**
 * @constructor
 * @todo:
 *      according to specification https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
 *      - use `start` and `end` labels (terminology)
 *      - use `intervals` for structures like {start, end}
 *      - use `duration` for determining the amount of time (5 hours, 3 seconds)
 *
 *  Additional links:
 *      https://date-fns.org/v2.8.1/docs/Interval
 *      https://github.com/d3/d3-time#interval_range
 *      https://github.com/luisfarzati/moment-interval
 *
 **/
const PeriodFilter: React.FunctionComponent<React.PropsWithChildren<Props>> = ({
    isFormLine,
    className = '',
    values,
    options = {},
    onChange,
    outlined,
    boundaries
}: React.PropsWithChildren<Props>) => {
    const i18n = useContext(I18nContext);
    const controlClassName: string | undefined = outlined ? outlinedControl : undefined;
    const [periodValues, setPeriodValues] = useStateFromProp(values);
    const onDateFieldChange = useCallback(
        (field: string, value: Date) => {
            const {fromDate, toDate} = periodValues;
            const period: DateRange = getFilterPeriod(
                {
                    oldValue: fromDate,
                    value: field === 'fromDate' ? value : fromDate
                },
                {
                    oldValue: toDate,
                    value: field === 'toDate' ? value : toDate
                },
                options
            );
            const newPeriodValues: PeriodFilterValues = {
                fromDate: period.startDate,
                toDate: period.endDate
            };

            setPeriodValues(newPeriodValues);
            onChange(newPeriodValues);
        },
        [periodValues, values, onChange]
    );

    return (
        <div className={isFormLine ? undefined : `${filtersSection} ${filtersSectionAsRow} ${className}`}>
            <div className={isFormLine ? formLine : section}>
                <div className={isFormLine ? formLineLabel : filterLabel}>
                    {localize(i18n, 'trader.filters.startDate')}
                </div>
                <DatePicker
                    name="fromDate"
                    required={true}
                    className={controlClassName}
                    min={boundaries?.start}
                    max={periodValues.toDate || boundaries?.end}
                    onChange={onDateFieldChange}
                    value={periodValues.fromDate}
                />
            </div>
            <div className={isFormLine ? formLine : section}>
                <div className={isFormLine ? formLineLabel : filterLabel}>
                    {localize(i18n, 'trader.filters.endDate')}
                </div>
                <DatePicker
                    id="toDate"
                    name="toDate"
                    required={true}
                    className={controlClassName}
                    min={periodValues.fromDate || boundaries?.start}
                    max={boundaries?.end}
                    onChange={onDateFieldChange}
                    value={periodValues.toDate}
                />
            </div>
        </div>
    );
};

export default React.memo(PeriodFilter);
