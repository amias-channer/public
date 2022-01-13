import getMonthName from 'frontend-core/dist/services/date/get-month-name';
import range from 'frontend-core/dist/utils/range';
import * as React from 'react';
import {I18nContext} from '../app-component/app-context';
import {item, moreButton, selectedItem, table as tableClassName, tableCell, tableControls} from './datepicker.css';
import NavButton from './nav-button';

interface Props {
    selectedValue: Date;
    checkValueLimits(year: number, month: number, date: number): boolean;
    onYearChange(year: number): void;
    onModeChange(): void;
    onChange(month: number): void;
}

const {useContext} = React;
const colsCount: number = 3;
const rowsRange = range(0, 3);
const colsRange = range(0, colsCount - 1);
const MonthView: React.FunctionComponent<Props> = ({
    selectedValue,
    checkValueLimits,
    onModeChange,
    onYearChange,
    onChange
}) => {
    const i18n = useContext(I18nContext);
    const selectedYear: number = selectedValue.getFullYear();
    const selectedMonth: number = selectedValue.getMonth();
    const selectedDate: number = selectedValue.getDate();

    return (
        <table className={tableClassName}>
            <thead>
                <tr>
                    <th colSpan={colsCount}>
                        <div className={tableControls}>
                            <NavButton onClick={onYearChange.bind(null, selectedYear - 1)} />
                            <button
                                type="button"
                                data-name="yearModeButton"
                                className={moreButton}
                                onClick={onModeChange}
                                tabIndex={-1}>
                                {selectedYear}
                            </button>
                            <NavButton onClick={onYearChange.bind(null, selectedYear + 1)} forward={true} />
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                {rowsRange.map((rowIndex) => (
                    <tr key={`row-${rowIndex}`}>
                        {colsRange.map((colIndex) => {
                            const month: number = rowIndex * colsCount + colIndex;
                            const isDisabled: boolean = !checkValueLimits(selectedYear, month, selectedDate);
                            const isSelected: boolean = month === selectedMonth;

                            return (
                                <td className={tableCell} key={`col-${colIndex}`}>
                                    <button
                                        type="button"
                                        data-name="monthButton"
                                        className={`${item} ${isSelected ? selectedItem : ''}`}
                                        data-selected={isSelected}
                                        onClick={isDisabled ? undefined : onChange.bind(null, month)}
                                        disabled={isDisabled}
                                        tabIndex={-1}>
                                        <span>{getMonthName(i18n, month + 1)}</span>
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

export default React.memo(MonthView);
