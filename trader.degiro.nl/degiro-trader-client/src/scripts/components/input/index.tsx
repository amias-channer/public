import getDisabledAutofillAttrs from 'frontend-core/dist/components/ui-trader4/form/get-disabled-autofill-attrs';
import * as React from 'react';
import {
    floatPlaceholder,
    inputFieldControl,
    inputFieldLayout,
    invalidInputFieldLayout,
    wideInputFieldLayout
} from './input.css';

type InputHtmlProps = React.HTMLProps<HTMLInputElement>;

export enum InputSizes {
    WIDE = 'WIDE'
}

export interface InputProps extends Omit<InputHtmlProps, 'size' | 'ref'> {
    invalid?: boolean;
    size?: InputSizes;
    controlClassName?: string;
    hideFloatPlaceholder?: boolean;
}

const {useRef, useLayoutEffect} = React;
const Input: React.ForwardRefRenderFunction<HTMLInputElement, React.PropsWithChildren<InputProps>> = (
    {invalid, size, className, controlClassName, hideFloatPlaceholder, children, autoFocus, ...inputDomProps},
    ref
) => {
    const defaultInputRef = useRef<HTMLInputElement | null>(null);
    const inputRef = (ref as React.MutableRefObject<HTMLInputElement | null> | null) || defaultInputRef;

    useLayoutEffect(() => {
        const {current: input} = inputRef;

        // autoFocus doesn't work always on mobile device when you go back and forth through navigation history
        if (input && autoFocus) {
            requestAnimationFrame(() => input.focus());
        }
    }, []);

    const {placeholder} = inputDomProps;
    const layoutClassNames: string[] = [inputFieldLayout];
    const inputClassNames: string[] = [inputFieldControl];

    if (size === InputSizes.WIDE) {
        layoutClassNames.push(wideInputFieldLayout);
    }

    if (invalid) {
        layoutClassNames.push(invalidInputFieldLayout);
    }

    if (className) {
        layoutClassNames.push(className);
    }

    if (controlClassName) {
        inputClassNames.push(controlClassName);
    }

    // Do not remove data-name="inputLayout", it can be used by E2E test and ProductTour component
    return (
        <div className={layoutClassNames.join(' ')} data-name="inputLayout">
            <input
                {...getDisabledAutofillAttrs(inputDomProps.name)}
                {...inputDomProps}
                ref={inputRef}
                className={inputClassNames.join(' ')}
            />
            {placeholder && !hideFloatPlaceholder && !inputDomProps.disabled && (
                <span className={floatPlaceholder}>{placeholder}</span>
            )}
            {children}
        </div>
    );
};

export default React.memo(React.forwardRef(Input));
