import * as React from 'react';
import {formLine, formLineValue} from '../form-line-select-filter/form-line-select-filter.css';
import {disabledClassName, filedLabel} from './form-line-filter-item.css';

type Props = React.PropsWithChildren<{
    label: React.ReactNode;
    disabled: boolean;
}>;

const {memo} = React;
const FormLineFilterItem = memo<Props>(({label, disabled, children}) => (
    <div className={`${formLine} ${disabled ? disabledClassName : ''}`}>
        <div className={filedLabel}>{label}</div>
        <span className={formLineValue}>{children}</span>
    </div>
));

FormLineFilterItem.displayName = 'FormLineFilterItem';
export default FormLineFilterItem;
