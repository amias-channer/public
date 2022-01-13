import range from 'frontend-core/dist/utils/range';
import * as React from 'react';
import {
    item,
    moreButton,
    selectedItem,
    table as tableClassName,
    tableCell,
    tableControls,
    tableControlsWithSingleControl
} from './datepicker.css';

interface Props {
    selectedValue: Date;
    checkValueLimits(year: number, month: number, date: number): boolean;
    onChange(year: number): void;
}

const colsCount: number = 4;
const rowsRange = range(0, 4);
const colsRange = range(0, colsCount - 1);
const YearView: React.FunctionComponent<Props> = ({selectedValue, checkValueLimits, onChange}) => {
    const selectedYear: number = selectedValue.getFullYear();
    const selectedMonth: number = selectedValue.getMonth();
    const selectedDate: number = selectedValue.getDate();
    const valueYearIndex: number = 17;

    return (
        <table className={tableClassName}>
            <thead>
                <tr>
                    <th colSpan={colsCount}>
                        <div className={`${tableControls} ${tableControlsWithSingleControl}`}>
                            <button type="button" className={moreButton} disabled={true} tabIndex={-1}>
                                {`${selectedYear - valueYearIndex} - ${selectedYear + 2}`}
                            </button>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                {rowsRange.map((rowIndex) => (
                    <tr key={`row-${rowIndex}`}>
                        {colsRange.map((colIndex) => {
                            const yearIndex: number = rowIndex * colsCount + colIndex;
                            const year: number = selectedYear + yearIndex - valueYearIndex;
                            const isDisabled: boolean = !checkValueLimits(year, selectedMonth, selectedDate);
                            const isSelected: boolean = year === selectedYear;

                            return (
                                <td className={tableCell} key={`col-${colIndex}`}>
                                    <button
                                        type="button"
                                        data-name="yearButton"
                                        className={`${item} ${isSelected ? selectedItem : ''}`}
                                        onClick={isDisabled ? undefined : onChange.bind(null, year)}
                                        disabled={isDisabled}
                                        tabIndex={-1}>
                                        {year}
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

export default React.memo(YearView);
