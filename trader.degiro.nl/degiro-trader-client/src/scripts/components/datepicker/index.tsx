import Icon from 'frontend-core/dist/components/ui-trader4/icon/index';
import Popover from 'frontend-core/dist/components/ui-trader4/popover';
import formatDate from 'frontend-core/dist/utils/date/format-date';
import isEqualDate from 'frontend-core/dist/utils/date/is-equal-date';
import isValidDate from 'frontend-core/dist/utils/date/is-valid-date';
import parseDate from 'frontend-core/dist/utils/date/parse-date';
import addEventListenersOutside from 'frontend-core/dist/utils/events/add-event-listeners-outside';
import * as React from 'react';
import {Unsubscribe, unsubscribeAll} from '../../event-broker/subscription';
import canUseNativeDatepickerElement from './can-use-native-datepicker-element';
import DateView from './date-view';
import {input, inputIcon, inputWithIcon, layout as layoutClassName, popup} from './datepicker.css';
import {DatePickerModes} from './mode';
import MonthView from './month-view';
import YearView from './year-view';

export interface DatePickerProps {
    name: string;
    format?: string;
    id?: string;
    className?: string;
    controlClassName?: string;
    buttonClassName?: string;
    required?: boolean;
    disabled?: boolean;
    max?: Date;
    min?: Date;
    value?: Date | string;
    placeholder?: string;
    onChange?: (name: string, value: Date) => void;
}

const {useState, useRef, useEffect, useCallback, useReducer} = React;
const DatePicker: React.FunctionComponent<DatePickerProps> = ({
    value: initialValue,
    max,
    min,
    name,
    required,
    disabled,
    id,
    placeholder,
    format: initialFormat = 'DD/MM/YYYY',
    className = '',
    controlClassName = '',
    onChange
}) => {
    // used to re-render the component as a workaround for https://github.com/facebook/react/issues/8938
    const [, forceUpdate] = useReducer((x) => x + 1, 0);
    const dateInputRef = useRef<HTMLInputElement | null>(null);
    const refElementsRef = useRef<[HTMLElement | null, HTMLElement | null]>([null, null]);
    const [shouldUseNativeComponent] = useState<boolean>(canUseNativeDatepickerElement);
    const [mode, setMode] = useState<DatePickerModes | undefined>();
    const [hasPendingValueChange, setHasPendingValueChange] = useState<boolean>(false);
    const [selectedValue, setSelectedValue] = useState<Date | undefined>();
    const openPopup = useCallback(() => {
        setHasPendingValueChange(false);
        setMode((mode) => mode || DatePickerModes.DATE);
    }, []);
    const hasChangeHandler: boolean = !disabled && typeof onChange === 'function';
    const hasCustomCalendarChangeHandler: boolean = hasChangeHandler && !shouldUseNativeComponent;
    const format: string = shouldUseNativeComponent ? 'YYYY-MM-DD' : initialFormat;
    const hasPopup: boolean = !shouldUseNativeComponent && mode !== undefined;
    const [layoutEl] = refElementsRef.current;
    const onLayoutRef = (el: HTMLElement | null) => (refElementsRef.current[0] = el);
    const onPopupRef = (el: HTMLElement | null) => (refElementsRef.current[1] = el);
    const checkValueLimits = (year: number, month: number, date: number): boolean => {
        const timestamp: number = new Date(year, month, date, 0, 0, 0, 0).getTime();
        const minDateWithoutTime: Date | undefined =
            min && new Date(min.getFullYear(), min.getMonth(), min.getDate(), 0, 0, 0, 0);

        if (minDateWithoutTime && timestamp < minDateWithoutTime.getTime()) {
            return false;
        }

        const maxDateWithoutTime: Date | undefined =
            max && new Date(max.getFullYear(), max.getMonth(), max.getDate(), 0, 0, 0, 0);

        return !(maxDateWithoutTime && timestamp > maxDateWithoutTime.getTime());
    };
    const emitValueChange = useCallback((selectedValue: Date) => onChange?.(name, new Date(selectedValue)), [onChange]);
    const handleDateInputChange = useCallback(() => {
        const {current: dateInput} = dateInputRef;
        const newSelectedValue: Date | null | undefined = dateInput && parseDate(dateInput.value);

        if (!newSelectedValue) {
            /* used to re-render the component as a workaround for https://github.com/facebook/react/issues/8938
            The native iOS datepicker has a clear button, and it changes the DOM directly
            (the value of the input is shown empty, although the component still has the default value).
            We need to force a redraw so the state of the component is reflected in the DOM,
            otherwise it is frustrating for the user.*/
            forceUpdate();
        }

        if (
            newSelectedValue &&
            isValidDate(newSelectedValue) &&
            (hasPendingValueChange || !selectedValue || !isEqualDate(selectedValue, newSelectedValue)) &&
            checkValueLimits(newSelectedValue.getFullYear(), newSelectedValue.getMonth(), newSelectedValue.getDate())
        ) {
            setHasPendingValueChange(false);
            setSelectedValue(new Date(newSelectedValue));
            emitValueChange(newSelectedValue);
        }
    }, [hasPendingValueChange, selectedValue, emitValueChange]);
    const setMonth = (selectedValue: Date, month: number) => {
        setHasPendingValueChange(true);
        setSelectedValue(new Date(selectedValue.getFullYear(), month, 1));
        setMode(DatePickerModes.DATE);
    };
    const setYear = (selectedValue: Date, year: number) => {
        setHasPendingValueChange(true);
        setSelectedValue(new Date(year, selectedValue.getMonth(), 1));
        setMode(DatePickerModes.MONTH);
    };
    const setDate = (selectedValue: Date, date: number, month: number) => {
        const selectedDate: Date = new Date(selectedValue);

        selectedDate.setDate(date);
        selectedDate.setMonth(month);

        setSelectedValue(new Date(selectedDate));
        emitValueChange(selectedDate);
    };
    const onDateInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleDateInputChange();
        }
    };

    useEffect(() => {
        let selectedValue: Date | undefined;

        if (initialValue instanceof Date) {
            selectedValue = new Date(initialValue);
        } else if (typeof initialValue === 'string') {
            const date: Date | undefined = parseDate(initialValue);

            if (date && isValidDate(date)) {
                selectedValue = date;
            }
        }

        setHasPendingValueChange(false);
        setSelectedValue(selectedValue || new Date());
        setMode(undefined);
    }, [initialValue]);

    useEffect(() => {
        const {current: refElements} = refElementsRef;
        const closePopup = () => {
            setMode(undefined);

            // [TRADER-1867] we need to fire this check here as "blur" is not fire consistently across the browsers
            if (hasCustomCalendarChangeHandler) {
                handleDateInputChange();
            }
        };
        const unsubscribeList: Unsubscribe[] = [
            addEventListenersOutside(refElements, 'focusin', closePopup),
            // [REFINITIV-1445] - if we listen for `click` instead of `mousedown` and the datepicker appears
            // under the cursor (e.g. smaller screen or position near the bottom of the page) it is closed immediately
            addEventListenersOutside(refElements, 'mousedown', closePopup, {capture: true})
        ];

        return () => unsubscribeAll(unsubscribeList);
    }, [hasCustomCalendarChangeHandler, handleDateInputChange]);

    return (
        <div className={`${layoutClassName} ${className}`} ref={onLayoutRef} onClick={openPopup}>
            <input
                ref={dateInputRef}
                id={id}
                name={name}
                type={shouldUseNativeComponent ? 'date' : 'text'}
                tabIndex={0}
                placeholder={placeholder || format}
                className={`${input} ${inputWithIcon} ${controlClassName}`}
                required={required}
                disabled={disabled}
                min={shouldUseNativeComponent && min ? formatDate(min, format) : undefined}
                max={shouldUseNativeComponent && max ? formatDate(max, format) : undefined}
                value={selectedValue && formatDate(selectedValue, format)}
                onKeyDown={hasCustomCalendarChangeHandler ? onDateInputKeyDown : undefined}
                onChange={hasChangeHandler && shouldUseNativeComponent ? handleDateInputChange : undefined}
                onFocus={shouldUseNativeComponent ? undefined : openPopup}
            />
            <Icon type="event" data-name="datepickerIcon" className={inputIcon} />
            {hasPopup && layoutEl && selectedValue && (
                <Popover relatedElement={layoutEl} horizontalPosition="inside-start">
                    <div className={popup} ref={onPopupRef}>
                        {/* eslint-disable react/jsx-no-bind */}
                        {mode === DatePickerModes.MONTH ? (
                            <MonthView
                                selectedValue={selectedValue}
                                checkValueLimits={checkValueLimits}
                                onYearChange={setYear.bind(null, selectedValue)}
                                onModeChange={setMode.bind(null, DatePickerModes.YEAR)}
                                onChange={setMonth.bind(null, selectedValue)}
                            />
                        ) : mode === DatePickerModes.YEAR ? (
                            <YearView
                                selectedValue={selectedValue}
                                checkValueLimits={checkValueLimits}
                                onChange={setYear.bind(null, selectedValue)}
                            />
                        ) : (
                            <DateView
                                selectedValue={selectedValue}
                                checkValueLimits={checkValueLimits}
                                onMonthChange={setMonth.bind(null, selectedValue)}
                                onModeChange={setMode.bind(null, DatePickerModes.MONTH)}
                                onChange={setDate.bind(null, selectedValue)}
                            />
                        )}
                    </div>
                </Popover>
            )}
        </div>
    );
};

export default React.memo(DatePicker);
