import * as React from 'react';
import Popover from 'frontend-core/dist/components/ui-trader4/popover';
import useToggle from 'frontend-core/dist/hooks/use-toggle';
import addEventListenersOutside from 'frontend-core/dist/utils/events/add-event-listeners-outside';
import OptionsList from '../options-list';

export interface SelectApi<T extends any = any> {
    selectedItemIndex: number;
    activeItemIndex: number;
    isOpened: boolean;
    select: (item: T) => void;
    activateItem: (index: number) => void;
    toggle: () => void;
}

interface Props<T extends any = any> {
    data: T[];
    value: T;
    onChange?: (value: T) => void;
    children: (value: T, index: number, api: SelectApi<T>) => React.ReactNode;
    target: (value: T, api: SelectApi<T>) => React.ReactNode;
    getValueIndex?: (data: T[], value: T) => number;
}

const {useState, useRef, useCallback, useLayoutEffect, useMemo, memo} = React;
const Select = memo<Props>(
    ({data: options, value, onChange, target, children, getValueIndex = (data, value) => data.indexOf(value)}) => {
        const popupToggle = useToggle(false);
        const [selectedItemIndex, setSelectedItemIndex] = useState<number>(getValueIndex(options, value));
        const [activeItemIndex, setActiveItemIndex] = useState<number>(selectedItemIndex);
        const inputWrapperEl = useRef<HTMLDivElement>(null);
        const optionsListEl = useRef<HTMLDivElement>(null);
        const changeHandler = useCallback(
            (value) => {
                const activeItemIndex = getValueIndex(options, value);

                popupToggle.close();
                setActiveItemIndex(activeItemIndex);
                setSelectedItemIndex(activeItemIndex);

                onChange?.(value);
            },
            [activeItemIndex, popupToggle.isOpened, onChange]
        );

        useLayoutEffect(() => {
            const unsubscribeList = [
                addEventListenersOutside([inputWrapperEl.current, optionsListEl.current], 'click', popupToggle.close),
                addEventListenersOutside([inputWrapperEl.current, optionsListEl.current], 'scroll', popupToggle.close, {
                    passive: true,
                    capture: true
                }),
                addEventListenersOutside([inputWrapperEl.current, optionsListEl.current], 'focusin', popupToggle.close)
            ];

            return () => unsubscribeList.forEach((unsubscribeFn) => unsubscribeFn());
        }, [popupToggle.isOpened]);

        const api = useMemo<SelectApi>(
            () => ({
                selectedItemIndex,
                activeItemIndex,
                select: changeHandler,
                activateItem: (index: number) => setActiveItemIndex(index),
                toggle: popupToggle.toggle, // this is ok that popupToggle is not in dependency list,
                isOpened: popupToggle.isOpened
            }),
            [changeHandler, selectedItemIndex, activeItemIndex, popupToggle]
        );

        return (
            <>
                <div ref={inputWrapperEl}>{target(value, api)}</div>
                {popupToggle.isOpened && inputWrapperEl.current && (
                    <Popover
                        width="target-width"
                        horizontalPosition="inside-start"
                        relatedElement={inputWrapperEl.current}>
                        <OptionsList ref={optionsListEl} length={options.length} activeItemIndex={activeItemIndex}>
                            {(i) => children(options[i], i, api)}
                        </OptionsList>
                    </Popover>
                )}
            </>
        );
    }
);

Select.displayName = 'Select';
export default Select as <T extends any = any>(props: Props<T>) => JSX.Element;
