import * as React from 'react';
import canUseNativeSelectElement from './can-use-native-select-element';
import getSelectOptionValue from './get-select-option-value';
import isDisabled from './is-disabled';
import { disabledSelect, select, smallSelect, wideSelect, xsmallSelect } from './select.css';
import CustomSingleSelect from './single/custom-select';
import NativeSingleSelect from './single/native-select';
export var SelectSizes;
(function (SelectSizes) {
    SelectSizes["SMALL"] = "SMALL";
    SelectSizes["WIDE"] = "WIDE";
    SelectSizes["XSMALL"] = "XSMALL";
})(SelectSizes || (SelectSizes = {}));
export const sizesClassNames = {
    [SelectSizes.XSMALL]: xsmallSelect,
    [SelectSizes.SMALL]: smallSelect,
    [SelectSizes.WIDE]: wideSelect
};
const { useState } = React;
function getDefaultSelectedOption(options, selectedOption, placeholder) {
    if (selectedOption) {
        const selectedValue = getSelectOptionValue(selectedOption);
        const defaultSelectedOption = options.find((option) => selectedValue === getSelectOptionValue(option));
        if (defaultSelectedOption) {
            return defaultSelectedOption;
        }
    }
    if (!placeholder) {
        return options[0];
    }
}
function Select(props) {
    const [canUseNativeSingleSelectElement] = useState(canUseNativeSelectElement);
    const { options, className = '', onlyCustom, size = SelectSizes.SMALL } = props;
    const sizeClassName = sizesClassNames[size];
    const selectedOption = getDefaultSelectedOption(options, props.selectedOption, props.placeholder);
    const disabled = isDisabled(options, props.disabled, selectedOption && [selectedOption]);
    const disableClassName = disabled ? disabledSelect : '';
    const componentProps = {
        ...props,
        selectedOption,
        disabled,
        className: `${select} ${disableClassName} ${className} ${sizeClassName}`,
        optionsListClassName: sizeClassName
    };
    return !onlyCustom && canUseNativeSingleSelectElement ? (React.createElement(NativeSingleSelect, { ...componentProps })) : (React.createElement(CustomSingleSelect, { ...componentProps }));
}
export default React.memo(Select);
//# sourceMappingURL=index.js.map