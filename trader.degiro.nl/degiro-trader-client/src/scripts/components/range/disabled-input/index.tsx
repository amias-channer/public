import * as React from 'react';
import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import InputPlaceholder from '../input-placeholder';
import {input as inputClassName, showMoreButton} from '../input-placeholder/input-placeholder.css';
import {disabledInput, disabledIcon} from './disabled-input.css';
import {icon} from '../base-range/base-range.css';

interface Props {
    value: string;
    className?: string;
}

const DisabledInput: React.FunctionComponent<Props> = ({value, className = ''}) => (
    <InputPlaceholder
        className={className}
        suffix={
            <span className={showMoreButton}>
                <Icon className={`${icon} ${disabledIcon}`} type="keyboard_arrow_down" />
            </span>
        }>
        <input
            tabIndex={-1}
            type="text"
            disabled={true}
            readOnly={true}
            value={value}
            className={`${disabledInput} ${inputClassName}`}
        />
    </InputPlaceholder>
);

export default React.memo(DisabledInput);
