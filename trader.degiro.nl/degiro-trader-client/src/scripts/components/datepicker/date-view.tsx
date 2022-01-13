import getDayName from 'frontend-core/dist/services/date/get-day-name';
import getMonthName from 'frontend-core/dist/services/date/get-month-name';
import getDatesInMonth from 'frontend-core/dist/utils/date/get-dates-in-month';
import padNumber from 'frontend-core/dist/utils/number/pad-number';
import range from 'frontend-core/dist/utils/range';
import * as React from 'react';
import {I18nContext} from '../app-component/app-context';
import {
    item,
    moreButton,
    selectedItem,
    table as tableClassName,
    tableCell,
    tableControls,
    tableHeaderCell
} from './datepicker.css';
import NavButton from './nav-button';

interface Props {
    selectedValue: Date;
    checkValueLimits(year: number, month: number, date: number): boolean;
    onModeChange(): void;
    onMonthChange(month: number): void;
    onChange(date: number, month: number): void;
}

const {useContext} = React;
const colsCount: number = 7;
const rowsRange = range(0, 5);
const colsRange = range(0, colsCount - 1);
const DateView: React.FunctionComponent<Props> = ({
    selectedValue,
    checkValueLimits,
    onModeChange,
    onMonthChange,
    onChange
}) => {
    const i18n = useContext(I18nContext);
    const selectedYear: number = selectedValue.getFullYear();
    const selectedMonth: number = selectedValue.getMonth();
    const selectedDate: number = selectedValue.getDate();
    const monthBegin: Date = new Date(selectedYear, selectedMonth, 1);
    const monthFirstDayIndex: number = monthBegin.getDay();
    const currentMonthDates: number[] = getDatesInMonth(selectedMonth, selectedYear);
    const previousMonthDates: number[] = getDatesInMonth(selectedMonth - 1, selectedYear);
    const previousMonthDatesCount: number = previousMonthDates.length;
    const nextMonthDates: number[] = getDatesInMonth(selectedMonth + 1, selectedYear);

    return (
        <table className={tableClassName}>
            <thead>
                <tr>
                    <th colSpan={colsCount}>
                        <div className={tableControls}>
                            <NavButton onClick={onMonthChange.bind(null, selectedMonth - 1)} />
                            <button
                                type="button"
                                data-name="monthModeButton"
                                className={moreButton}
                                onClick={onModeChange}
                                tabIndex={-1}>
                                {`${getMonthName(i18n, selectedMonth + 1)} ${selectedYear}`}
                            </button>
                            <NavButton onClick={onMonthChange.bind(null, selectedMonth + 1)} forward={true} />
                        </div>
                    </th>
                </tr>
                <tr>
                    {colsRange.map((colIndex) => (
                        <th className={tableHeaderCell} key={`dates-header-col-${colIndex}`}>
                            <span>{getDayName(i18n, colIndex)}</span>
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rowsRange.map((rowIndex) => (
                    <tr key={`row-${rowIndex}`}>
                        {colsRange.map((colIndex) => {
                            const dayIndex: number = rowIndex * colsCount + colIndex;
                            let date: number;
                            let month: number = selectedMonth;
                            let isSecondary: boolean = false;

                            if (dayIndex < monthFirstDayIndex) {
                                date = previousMonthDates[previousMonthDatesCount - monthFirstDayIndex + colIndex];
                                month--;
                                isSecondary = true;
                            } else {
                                date = currentMonthDates[dayIndex - monthFirstDayIndex];

                                if (date === undefined) {
                                    date = Number(nextMonthDates.shift());
                                    month++;
                                    isSecondary = true;
                                }
                            }
                            const isDisabled: boolean = !checkValueLimits(selectedYear, month, date);
                            const isSelected: boolean = !isSecondary && date === selectedDate;

                            return (
                                <td className={tableCell} key={`col-${colIndex}`}>
                                    <button
                                        type="button"
                                        data-name="dateButton"
                                        className={`${item} ${isSelected ? selectedItem : ''}`}
                                        data-selected={isSelected}
                                        onClick={isDisabled ? undefined : onChange.bind(null, date, month)}
                                        disabled={isDisabled}
                                        tabIndex={-1}>
                                        <span>{padNumber(date as number)}</span>
                                    </button>
                                </td>
                            );
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default React.memo(DateView);
