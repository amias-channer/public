import * as React from 'react';
import localize from 'frontend-core/dist/services/i18n/localize';
import stopEvent from 'frontend-core/dist/utils/stop-event';
import {Interval} from 'frontend-core/dist/models/interval';
import addEventListener from 'frontend-core/dist/utils/events/add-event-listener';
import {I18nContext} from '../../app-component/app-context';
import InputInterval from '../input-interval';
import {applyButton, inputInterval} from '../base-range/base-range.css';

type Props = React.PropsWithChildren<{
    index: number;
    boundaries: Interval<number>;
    value: Interval<number>;
    activeItemIndex: number;
    onClose?: () => void;
    onSelectNext?: () => void;
    onSelectPrev?: () => void;
    onFocus?: () => void;
    onChange?: (value: Interval<number>) => void;
    //                     full text format       suffix format
    //                 example: "10% — 12%"       "%" (suffix used for format like this: "<input value={1}/> %" )
    //                                   ↓        ↓
    format?: (n: Interval<number>) => [string, string];
}>;

const {useContext, useRef, useEffect, memo} = React;
const InputIntervalSelectOptionItem = memo<Props>(
    ({
        value,
        index,
        activeItemIndex,
        boundaries,
        onFocus,
        onClose,
        onSelectNext,
        onSelectPrev,
        onChange,
        format = () => ['', '']
    }) => {
        const i18n = useContext(I18nContext);
        const inputStartRef = useRef<HTMLInputElement>(null);
        const inputEndRef = useRef<HTMLInputElement>(null);
        const prevActiveItemIndex = useRef<number>(-1);

        useEffect(() => {
            const inputStartEl = inputStartRef.current;
            const inputEndEl = inputEndRef.current;
            const {activeElement} = document;

            if (!inputStartEl || !inputEndEl || activeElement === inputStartEl || activeElement === inputEndEl) {
                return;
            }
            if (activeItemIndex === index) {
                if (prevActiveItemIndex.current === 0) {
                    inputEndEl.focus();
                } else {
                    inputStartEl.focus();
                }
            } else {
                prevActiveItemIndex.current = activeItemIndex;
            }
        }, [activeItemIndex, index]);

        useEffect(() => {
            return inputStartRef.current && inputEndRef.current
                ? addEventListener([inputStartRef.current, inputEndRef.current], 'focus', () => onFocus?.())
                : undefined;
        }, [onFocus]);

        useEffect(() => {
            return inputStartRef.current
                ? addEventListener(inputStartRef.current, 'keydown', (event: KeyboardEvent) => {
                      const {key, shiftKey} = event;

                      if (key === 'ArrowUp' || key === 'ArrowDown' || (key === 'Tab' && shiftKey)) {
                          event.preventDefault();
                      }
                      if (key === 'Tab' && shiftKey) {
                          return inputEndRef.current?.focus();
                      }

                      switch (key) {
                          case 'Escape': {
                              event.stopPropagation();
                              onClose?.();
                              return;
                          }
                          case 'ArrowDown': {
                              return inputEndRef.current?.focus();
                          }
                          case 'ArrowUp': {
                              onSelectPrev?.();
                          }
                      }
                  })
                : undefined;
        }, [onClose, onSelectPrev]);

        useEffect(() => {
            return inputEndRef.current
                ? addEventListener(inputEndRef.current, 'keydown', (event: KeyboardEvent) => {
                      const {key} = event;

                      if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'Tab') {
                          event.preventDefault();
                      }

                      switch (key) {
                          case 'Tab': {
                              return inputStartRef.current?.focus();
                          }
                          case 'Escape': {
                              event.stopPropagation();
                              onClose?.();
                              return;
                          }
                          case 'ArrowDown': {
                              onSelectNext?.();
                              return;
                          }
                          case 'ArrowUp': {
                              return inputStartRef.current?.focus();
                          }
                      }
                  })
                : undefined;
        }, [onClose, onSelectNext]);

        return (
            <InputInterval
                value={value}
                inputStartRef={inputStartRef}
                inputEndRef={inputEndRef}
                className={inputInterval}
                minValue={boundaries.start}
                maxValue={boundaries.end}
                onChange={onChange}>
                {format(value)[1]}
                <button type="submit" className={applyButton} onMouseDown={stopEvent /* Disable "blur" event*/}>
                    {localize(i18n, 'trader.filtersList.interval.apply')}
                </button>
            </InputInterval>
        );
    }
);

InputIntervalSelectOptionItem.displayName = 'InputIntervalSelectOptionItem';
export default InputIntervalSelectOptionItem;
