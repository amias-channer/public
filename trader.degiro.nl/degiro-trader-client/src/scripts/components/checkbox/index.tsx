import {inlineLeft} from 'frontend-core/dist/components/ui-trader4/alignment-utils.css';
import * as React from 'react';
import {input as inputClassName, label as labelClassName, layout, thumb} from './checkbox.css';

type InputHtmlProps = React.HTMLProps<HTMLInputElement>;

export interface CheckboxProps extends Omit<InputHtmlProps, 'label' | 'type'> {
    label?: React.ReactNode;
}

const Checkbox: React.FunctionComponent<CheckboxProps> = ({label, className = '', ...inputProps}) => (
    <label className={`${layout} ${className}`}>
        <input {...inputProps} type="checkbox" className={inputClassName} />
        <span className={`${thumb} ${label ? inlineLeft : ''}`} />
        {typeof label === 'string' ? <span className={labelClassName}>{label}</span> : label}
    </label>
);

export default React.memo(Checkbox);
