import * as React from 'react';
import {Interval} from 'frontend-core/dist/models/interval';
import stopEvent from 'frontend-core/dist/utils/stop-event';
import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import isInfinityInterval from 'frontend-core/dist/utils/interval/is-infinity-interval';
import localize from 'frontend-core/dist/services/i18n/localize';
import {filterOptionAllLabel} from 'frontend-core/dist/services/filter';
import formatInterval from 'frontend-core/dist/utils/interval/format-interval';
import Select from '../select';
import InputPlaceholder from '../input-placeholder';
import {input as inputClassName, showMoreButton} from '../input-placeholder/input-placeholder.css';
import {icon} from '../base-range/base-range.css';
import {activeOptionItem, optionItem, selectedOptionItem} from '../options-list/options-list.css';
import InputIntervalSelectOptionItem from '../options/input-interval-select-option-item';
import {I18nContext} from '../../app-component/app-context';
import useSelectInputKeyBindings from '../hooks/use-select-input-key-bindings';

interface Props<T extends any = any> {
    className?: string;
    data: T[];
    value: T;
    onChange: (value: T) => void;
    boundaries: Interval<number>;
    //                     full text format       suffix format
    //                 example: "10% — 12%"       "%" (suffix used for format like this: "<input value={1}/> %" )
    //                                   ↓        ↓
    format?: (n: Interval<number>) => [string, string];
}
const getValueIndex = (options: Interval[], value: Interval): number => {
    const valueIndex = options.findIndex(({start, end}) => start === value.start && end === value.end);

    return valueIndex < 0 ? options.length - 1 : valueIndex;
};
const {useRef, useContext, useMemo, memo} = React;
const SelectInterval = memo<Props>(
    ({className, data, value, onChange, format = (value: Interval) => [formatInterval(value), ''], boundaries}) => {
        const i18n = useContext(I18nContext);
        const inputEl = useRef<HTMLInputElement>(null);
        const extendedData = useMemo(() => [...data, {start: -Infinity, end: Infinity}], [data]);
        const onKeyDown = useSelectInputKeyBindings(extendedData, value);

        return (
            <Select<Interval<number>>
                onChange={onChange}
                data={extendedData}
                value={value}
                getValueIndex={getValueIndex}
                // eslint-disable-next-line react/jsx-no-bind
                target={(value, api) => {
                    const {toggle, isOpened} = api;

                    return (
                        <InputPlaceholder
                            className={className}
                            // eslint-disable-next-line react/jsx-no-bind
                            onClick={() => {
                                inputEl.current?.focus();
                                toggle();
                            }}
                            suffix={
                                <span className={showMoreButton} onMouseDown={stopEvent /* Disable "blur" event*/}>
                                    <Icon
                                        className={icon}
                                        type={isOpened ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                                    />
                                </span>
                            }>
                            <input
                                ref={inputEl}
                                type="text"
                                value={
                                    isInfinityInterval(value) ? localize(i18n, filterOptionAllLabel) : format(value)[0]
                                }
                                readOnly={true}
                                className={inputClassName}
                                onKeyDown={onKeyDown(api)}
                            />
                        </InputPlaceholder>
                    );
                }}>
                {(
                    option: Interval<number>,
                    i: number,
                    {selectedItemIndex, activeItemIndex, activateItem, toggle, select}
                ) => {
                    const className: string = `
                        ${optionItem}
                        ${selectedItemIndex === i ? selectedOptionItem : ''}
                        ${activeItemIndex === i ? activeOptionItem : ''}
                    `;

                    if (i === extendedData.length - 1) {
                        return (
                            <label className={className}>
                                <InputIntervalSelectOptionItem
                                    format={format}
                                    boundaries={boundaries}
                                    value={value}
                                    index={i}
                                    activeItemIndex={activeItemIndex}
                                    // eslint-disable-next-line react/jsx-no-bind
                                    onClose={() => {
                                        inputEl.current?.focus();
                                        toggle();
                                    }}
                                    // eslint-disable-next-line react/jsx-no-bind
                                    onSelectNext={() => {
                                        inputEl.current?.focus();
                                        activateItem(0);
                                    }}
                                    // eslint-disable-next-line react/jsx-no-bind
                                    onSelectPrev={() => {
                                        inputEl.current?.focus();
                                        activateItem(i - 1);
                                    }}
                                    // eslint-disable-next-line react/jsx-no-bind
                                    onFocus={() => activateItem(i)}
                                    // eslint-disable-next-line react/jsx-no-bind
                                    onChange={(data) => {
                                        inputEl.current?.focus();
                                        select(data);
                                    }}
                                />
                            </label>
                        );
                    }

                    return (
                        <div
                            className={className}
                            onClick={() => {
                                inputEl.current?.focus();
                                select(option);
                            }}
                            onMouseDown={stopEvent /* Disable "blur" event */}>
                            {isInfinityInterval(option) ? localize(i18n, filterOptionAllLabel) : format(option)[0]}
                        </div>
                    );
                }}
            </Select>
        );
    }
);

SelectInterval.displayName = 'SelectInterval';
export default SelectInterval;
