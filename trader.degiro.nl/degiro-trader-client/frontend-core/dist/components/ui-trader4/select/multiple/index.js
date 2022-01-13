import * as React from 'react';
import canUseNativeSelectElement from '../can-use-native-select-element';
import { SelectSizes, sizesClassNames } from '../index';
import isDisabled from '../is-disabled';
import { disabledSelect, select } from '../select.css';
import CustomMultiSelect from './custom-select';
import NativeMultiSelect from './native-select';
const { useState } = React;
const MultiSelect = (props) => {
    const [canUseNativeMultiSelectElement] = useState(canUseNativeSelectElement);
    const { selectedOptions = [], size = SelectSizes.SMALL, className = '', options, optionsListClassName = '' } = props;
    const disabled = isDisabled(options, props.disabled, selectedOptions);
    const sizeClassName = sizesClassNames[size];
    const disabledClassName = disabled ? disabledSelect : '';
    const componentProps = {
        ...props,
        selectedOptions,
        disabled,
        className: `${select} ${sizeClassName} ${disabledClassName} ${className}`,
        optionsListClassName: `${sizeClassName} ${optionsListClassName}`
    };
    return !props.onlyCustom && canUseNativeMultiSelectElement ? (React.createElement(NativeMultiSelect, { ...componentProps })) : (React.createElement(CustomMultiSelect, { ...componentProps }));
};
export default React.memo(MultiSelect);
//# sourceMappingURL=index.js.map