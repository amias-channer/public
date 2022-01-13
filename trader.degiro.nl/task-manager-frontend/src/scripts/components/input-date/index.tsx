import Input, {InputProps} from 'frontend-core/dist/components/ui-trader3/input/index';
import * as inputStyles from 'frontend-core/dist/components/ui-trader3/input/input.css';
import Select, {SelectValue} from 'frontend-core/dist/components/ui-trader3/select';
import useStateFromProp from 'frontend-core/dist/hooks/use-state-from-prop';
import getMonthName from 'frontend-core/dist/services/date/get-month-name';
import localize from 'frontend-core/dist/services/i18n/localize';
import padNumber from 'frontend-core/dist/utils/number/pad-number';
import * as React from 'react';
import {I18nContext} from '../app-component/app-context';
import * as inputDateStyles from './input-date.css';

// IMPORTANT: React/Preact do not trigger "onInput" or "onChange" handlers on input[type="hidden"]
export interface InputDateProps
    extends Pick<InputProps, 'id' | 'error' | 'label' | 'required' | 'disabled' | 'className' | 'inputFieldClassName'> {
    name: string;
    minYear?: number;
    maxYear?: number;
    value?: string;
    onChange?: (value: string, name: string) => void;
}

interface DateValue {
    date: string;
    month: string;
    year: string;
}

const {useRef, useMemo, useContext, useCallback} = React;
const currentYear: number = new Date().getFullYear();
const defaultMinYear: number = currentYear - 150;
const defaultMaxYear: number = currentYear + 100;
const isValid = ({date, month, year}: DateValue, minYear: number, maxYear: number) => {
    const dateNum = Number(date);

    if (dateNum < 1 || dateNum > 31) {
        return false;
    }

    const monthNum = Number(month);

    if (monthNum < 1 || monthNum > 12) {
        return false;
    }

    const yearNum = Number(year);

    return yearNum >= minYear && yearNum <= maxYear;
};
const prepareValueForState = (value: string) => value.trim().replace(/^0+/, '');
const InputDate: React.FunctionComponent<InputDateProps> = ({
    id,
    name,
    error,
    label,
    required,
    disabled,
    inputFieldClassName,
    className = '',
    minYear = defaultMinYear,
    maxYear = defaultMaxYear,
    value: valueFromProp = '',
    onChange
}) => {
    const i18n = useContext(I18nContext);
    const hiddenInputRef = useRef<HTMLInputElement | null>(null);
    const [value, setValue] = useStateFromProp<string, DateValue>(
        valueFromProp,
        (value: string): DateValue => {
            const [year, month = '', date = ''] = value.split('-');
            const dateValue: DateValue = {
                date: prepareValueForState(date),
                month: prepareValueForState(month),
                year: prepareValueForState(year)
            };

            return isValid(dateValue, minYear, maxYear) ? dateValue : {date: '', month: '', year: ''};
        }
    );
    const monthValues: SelectValue[] = useMemo(
        () => [
            {id: '', label: localize(i18n, 'taskManager.inputDate.month.label')},
            ...Array.from({length: 12}, (_, index: number) => ({
                id: String(index + 1),
                label: getMonthName(i18n, index + 1)
            }))
        ],
        [i18n]
    );
    const getFormValue = useCallback(
        (value: DateValue): string => {
            return isValid(value, minYear, maxYear)
                ? `${value.year}-${padNumber(value.month)}-${padNumber(value.date)}`
                : '';
        },
        [minYear, maxYear]
    );
    const handleValueChange = useCallback(
        (value: DateValue) => {
            const {current: input} = hiddenInputRef;
            const formValue: string = getFormValue(value);

            if (input && input.value !== formValue) {
                // we need to set value here to trigger `change` event on updated input
                input.value = formValue;
                input.dispatchEvent(new Event('change', {bubbles: true, cancelable: true}));
                onChange?.(formValue, name);
            }
        },
        [getFormValue, onChange, name]
    );
    const onDateChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const newValue: DateValue = {...value, date: prepareValueForState(event.currentTarget.value)};

            handleValueChange(newValue);
            setValue(newValue);
        },
        [handleValueChange, value]
    );
    const onMonthChange = useCallback(
        (event: React.ChangeEvent<HTMLSelectElement>) => {
            const newValue: DateValue = {...value, month: prepareValueForState(event.currentTarget.value)};

            handleValueChange(newValue);
            setValue(newValue);
        },
        [handleValueChange, value]
    );
    const onYearChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const newValue: DateValue = {...value, year: prepareValueForState(event.currentTarget.value)};

            handleValueChange(newValue);
            setValue(newValue);
        },
        [handleValueChange, value]
    );
    const {date, month, year} = value;
    const errorMessage: string | undefined = error && error.text;

    return (
        <div className={`${inputDateStyles.inputDate} ${className}`}>
            {label && (
                <label htmlFor="dateInput" className={inputStyles.inputLabel}>
                    {label}
                </label>
            )}
            <input
                type="hidden"
                id={id}
                name={name}
                data-field-name={name}
                value={getFormValue(value)}
                ref={hiddenInputRef}
            />
            <div className={inputDateStyles.row}>
                <Input
                    type="tel"
                    placeholder={localize(i18n, 'taskManager.inputDate.day.label')}
                    name="dateInput"
                    inputFieldClassName={inputFieldClassName}
                    className={inputDateStyles.date}
                    value={date}
                    disabled={disabled}
                    required={required}
                    pattern="\d{1,2}"
                    step={1}
                    minLength={1}
                    maxLength={2}
                    min={1}
                    max={31}
                    onInput={onDateChange}
                />
                <Select
                    name="monthInput"
                    className={inputDateStyles.month}
                    values={monthValues}
                    value={month}
                    controlClassName={inputFieldClassName}
                    disabled={disabled}
                    required={required}
                    onChange={onMonthChange}
                    disableFirstOption={true}
                />
                <Input
                    name="yearInput"
                    type="tel"
                    placeholder={localize(i18n, 'taskManager.inputDate.year.label')}
                    className={inputDateStyles.year}
                    pattern="\d{4}"
                    inputFieldClassName={inputFieldClassName}
                    min={minYear}
                    max={maxYear}
                    step={1}
                    minLength={4}
                    maxLength={4}
                    disabled={disabled}
                    required={required}
                    value={year}
                    onInput={onYearChange}
                />
            </div>
            {errorMessage && (
                <div className={`${inputStyles.inputHint} ${inputStyles.inputHintError}`}>{errorMessage}</div>
            )}
        </div>
    );
};

export default React.memo(InputDate);
