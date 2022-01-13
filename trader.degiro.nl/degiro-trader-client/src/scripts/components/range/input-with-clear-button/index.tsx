import * as React from 'react';
import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import stopEvent from 'frontend-core/dist/utils/stop-event';
import {inputWithClearButton, clearButton, clearIcon, wrapper} from './input-with-clear-button.css';
import InputPlaceholder from '../input-placeholder';

const {useRef, useCallback} = React;
const InputWithClearButton: React.ForwardRefRenderFunction<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
> = ({className, value, ...props}, ref) => {
    const defaultInputElRef = useRef<HTMLInputElement>(null);
    const actualInputRef: React.RefObject<HTMLInputElement> =
        (ref as React.RefObject<HTMLInputElement>) || defaultInputElRef;
    const clearValue = useCallback((event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        event.preventDefault();
        event.stopPropagation();

        const inputEl = actualInputRef.current;

        if (!inputEl) {
            return;
        }

        inputEl.value = '';
        inputEl.dispatchEvent(new Event('input', {bubbles: true}));
        inputEl.dispatchEvent(new Event('change', {bubbles: true}));
        inputEl.focus();
    }, []);

    return (
        <InputPlaceholder
            className={`${inputWithClearButton} ${wrapper}`}
            suffix={
                <button
                    tabIndex={-1}
                    type="reset"
                    className={clearButton}
                    onClick={clearValue} // Prevent blur on active element
                    onMouseDown={stopEvent}>
                    {value ? <Icon type="close" className={clearIcon} /> : null}
                </button>
            }>
            <input {...props} ref={actualInputRef} value={value} className={className} />
        </InputPlaceholder>
    );
};

export default React.memo(React.forwardRef(InputWithClearButton));
