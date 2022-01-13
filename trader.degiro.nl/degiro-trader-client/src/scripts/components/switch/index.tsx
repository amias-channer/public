import {inlineLeft} from 'frontend-core/dist/components/ui-trader4/alignment-utils.css';
import Icon from 'frontend-core/dist/components/ui-trader4/icon/index';
import * as React from 'react';
import {checkbox, checkboxWrapper, disabledLayout, label as labelClassName, layout, thumb, track} from './switch.css';

type InputHtmlProps = React.HTMLProps<HTMLInputElement>;

export interface SwitchProps extends Omit<InputHtmlProps, 'label'> {
    label?: React.ReactNode;
    inTransition?: boolean;
    protected?: boolean;
}

const {useRef, useLayoutEffect} = React;
const Switch: React.FunctionComponent<SwitchProps> = ({
    autoFocus,
    inTransition,
    onChange,
    label,
    className = '',
    protected: hasProtectedChangeHandler,
    ...inputProps
}) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const onProtectedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input: HTMLInputElement = event.currentTarget;

        // revert value
        input.checked = !input.checked;

        if (typeof onChange === 'function') {
            onChange(event);
        }
    };

    useLayoutEffect(() => {
        const {current: inputEl} = inputRef;

        // autoFocus doesn't work always on mobile device when you go back and forth through navigation history
        if (inputEl && autoFocus) {
            requestAnimationFrame(() => inputEl.focus());
        }
    }, []);

    if (inTransition) {
        return <Icon type="sync" spin={true} />;
    }

    return (
        <label className={`${inputProps.disabled ? disabledLayout : layout} ${className}`} aria-label="Toggle">
            <div className={`${checkboxWrapper} ${label ? inlineLeft : ''}`}>
                <input
                    {...inputProps}
                    type="checkbox"
                    className={checkbox}
                    ref={inputRef}
                    onChange={hasProtectedChangeHandler ? onProtectedChange : onChange}
                />
                <span className={track} />
                <span className={thumb} />
            </div>
            {typeof label === 'string' ? <span className={labelClassName}>{label}</span> : label}
        </label>
    );
};

export default React.memo(Switch);
